import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap} from 'rxjs';
import {ChatSession} from '../../../interfaces/ChatSession';
import {ChatMessage} from '../../../interfaces/ChatMessage';
import {SessionWithMessagesDto} from '../../../interfaces/SessionWithMessages';

@Injectable({
  providedIn: 'root'
})
export class ChatSessionService {
  private http = inject(HttpClient);
  private base = '/api/ChatSessions';

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();


  getSessionWithMessages(id: number): Observable<SessionWithMessagesDto> {
    return this.http.get<SessionWithMessagesDto>(`${this.base}/${id}`).pipe(
      tap(dto => {
        this.messagesSubject.next(dto.messages || []);
      }),
      catchError(error => {
        console.error('Failed to load session:', error);
        this.messagesSubject.next([]);
        throw error;
      })
    );
  }

  create(session: Partial<ChatSession>): Observable<ChatSession> {
    return this.http.post<ChatSession>(this.base, session).pipe(
      tap(() => {
        this.messagesSubject.next([]);
      }),
      catchError(error => {
        console.error('Failed to create session:', error);
        throw error;
      })
    );
  }

  addMessage(sessionId: number, message: Partial<ChatMessage>): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.base}/${sessionId}/messages`, message).pipe(
      tap(newMessage => {
        const currentMessages = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, newMessage]);
      }),
      catchError(error => {
        console.error('Failed to add message:', error);
        throw error;
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => {
        this.messagesSubject.next([]);
      }),
      catchError(error => {
        console.error('Failed to delete session:', error);
        throw error;
      })
    );
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
  }
}

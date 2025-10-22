import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ChatSession} from '../../../interfaces/ChatSession';
import {ChatMessage} from '../../../interfaces/ChatMessage';
import {SessionWithMessagesDto} from '../../../interfaces/SessionWithMessages';

@Injectable({
  providedIn: 'root'
})
export class ChatSessionService {
  private http = inject(HttpClient);
  private base = '/api/ChatSessions';

  getSessionWithMessages(id: number): Observable<SessionWithMessagesDto> {
    return this.http.get<SessionWithMessagesDto>(`${this.base}/${id}`);
  }

  create(session: Partial<ChatSession>): Observable<ChatSession> {
    return this.http.post<ChatSession>(this.base, session);
  }

  addMessage(sessionId: number, message: Partial<ChatMessage>): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.base}/${sessionId}/messages`, message);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}

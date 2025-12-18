import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap} from 'rxjs';
import {IChatSession} from '../../../interfaces/IChatSession';
import {IChatMessage} from '../../../interfaces/IChatMessage';
import {SessionWithMessagesDto} from '../../../interfaces/ISessionWithMessages';
import {IAttraction} from '../../../interfaces/IAttraction';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatSessionService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private base = '/api/ChatSessions';
  private messagesSubject = new BehaviorSubject<IChatMessage[]>([]);
  private attractionsSubject = new BehaviorSubject<IAttraction[]>([]);

  messages$ = this.messagesSubject.asObservable();
  attractions$ = this.attractionsSubject.asObservable();

  getUserSessions(userId: number): Observable<IChatSession[]> {
    return this.http.get<IChatSession[]>(`${this.base}/user/${userId}`);
  }

  getSessionById(id: number): Observable<SessionWithMessagesDto> {
    return this.http.get<SessionWithMessagesDto>(`${this.base}/${id}`).pipe(
      tap(dto => {
        this.messagesSubject.next(dto.messages || []);
        const attractions = dto.trip?.route || [];

        if (attractions.length > 0) {
          this.attractionsSubject.next(attractions);
          localStorage.setItem(this.getStorageKey(id), JSON.stringify(attractions));
        } else {
          this.loadAttractionsFromStorage(id);
        }
      }),
      catchError(error => {
        console.error('Failed to load session:', error);
        this.messagesSubject.next([]);
        this.attractionsSubject.next([]);
        throw error;
      })
    );
  }

  create(session: Partial<IChatSession>): Observable<IChatSession> {
    return this.http.post<IChatSession>(this.base, session).pipe(
      tap(() => {
        this.messagesSubject.next([]);
        this.attractionsSubject.next([]);
      }),
      catchError(error => {
        console.error('Failed to create session:', error);
        throw error;
      })
    );
  }

  addMessage(sessionId: number, message: Partial<IChatMessage>): Observable<IChatMessage> {
    return this.http.post<IChatMessage>(`${this.base}/${sessionId}/messages`, message).pipe(
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
        this.attractionsSubject.next([]);

        localStorage.removeItem(this.getStorageKey(id));

        if (this.router.url === `/chat/${id}`) {
          this.router.navigate(['/chat']);
        }
      }),
      catchError(error => {
        console.error('Failed to delete session:', error);
        throw error;
      })
    );
  }

  setAttractions(sessionId: number | null | undefined, attractions: IAttraction[]): void {
    const converted = attractions.map((place, index) =>
      this.convertAIResponseToAttraction(place, index)
    );
    console.log("Attractions set", converted);
    this.attractionsSubject.next(converted);
    localStorage.setItem(this.getStorageKey(sessionId), JSON.stringify(converted));
  }

  loadAttractionsFromStorage(sessionId: number | null | undefined): void {
    const stored = localStorage.getItem(this.getStorageKey(sessionId));
    if (stored) {
      try {
        const attractions = JSON.parse(stored);
        this.attractionsSubject.next(attractions);
      } catch {
        console.warn('Failed to parse stored attractions');
      }
    }
  }

  clearAttractions(sessionId: number | null | undefined): void {
    this.attractionsSubject.next([]);
    localStorage.removeItem(this.getStorageKey(sessionId));
  }

  clearAllAttractions(): void {
    localStorage.removeItem(this.getStorageKey(null));

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('chat_attractions_')) {
        localStorage.removeItem(key);
      }
    }

    this.attractionsSubject.next([]);
  }

  private getStorageKey(sessionId: number | null | undefined): string {
    const id = sessionId && !isNaN(sessionId) ? sessionId : 0;
    return `chat_attractions_${id}`;
  }

  private convertAIResponseToAttraction(place: IAttraction, index: number): IAttraction {
    return {
      ...place,
      id: index
    };
  }
}

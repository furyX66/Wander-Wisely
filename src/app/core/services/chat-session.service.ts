import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap} from 'rxjs';
import {IChatSession} from '../../../interfaces/IChatSession';
import {IChatMessage} from '../../../interfaces/IChatMessage';
import {SessionWithMessagesDto} from '../../../interfaces/SessionWithMessages';
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
  public messages$ = this.messagesSubject.asObservable();
  private attractionsSubject = new BehaviorSubject<IAttraction[]>([]);
  attractions$ = this.attractionsSubject.asObservable();

  getUserSessions(userId: number): Observable<IChatSession[]> {
    return this.http.get<IChatSession[]>(`${this.base}/user/${userId}`);
  }

  getSessionById(id: number): Observable<SessionWithMessagesDto> {
    return this.http.get<SessionWithMessagesDto>(`${this.base}/${id}`).pipe(
      tap(dto => {
        this.messagesSubject.next(dto.messages || []);
        this.attractionsSubject.next(dto.attractions || [])
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

  setAttractions(attractions: IAttraction[]): void {
    const converted = attractions.map(((place,index) => this.convertAIResponseToAttraction(place,  index)))
    this.attractionsSubject.next(converted);
  }

  private convertAIResponseToAttraction(place: any, index: number): IAttraction {
    return {
      id: index,
      title: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      type: place.type,
      imageUrl: place.photoUrl,
      price: place.price,
      rating: place.rating,
    };
  }
}

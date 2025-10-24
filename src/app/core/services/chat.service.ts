import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ChatResponse} from '../../features/chat-page/chat-page.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);

  chatAsk(sessionId: number, message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(
      `/api/ChatSessions/${sessionId}/ask`,
      { message }
    );
  }
  guestChatAsk( message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(
      `/api/ChatSessions/ask`,
      { message }
    );
  }
}

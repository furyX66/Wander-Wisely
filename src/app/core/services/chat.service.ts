import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ChatResponse} from '../../features/chat-page/chat-page.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);

  chatAsk(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>('/api/Chat/ask', { message });
  }
}

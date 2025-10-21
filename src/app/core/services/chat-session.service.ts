import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ChatSession} from '../../../interfaces/ChatSession';
import {ChatMessage} from '../../../interfaces/ChatMessage';
import {SessionWithMessagesDto} from '../../../interfaces/SessionWithMessages';

@Injectable({
  providedIn: 'root'
})
export class ChatSessionService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<ChatSession[]> {
    return this.http.get<ChatSession[]>("/api/ChatSessions");
  }

  getSessionWithMessages(id: number): Observable<SessionWithMessagesDto> {
    return this.http.get<SessionWithMessagesDto>(`/api/ChatSessions/${id}`);
  }

  create(session: Partial<ChatSession>): Observable<ChatSession> {
    return this.http.post<ChatSession>("/api/ChatSessions", session);
  }

  update(id: number, session: Partial<ChatSession>): Observable<void> {
    return this.http.put<void>(`/api/ChatSessions/${id}`, session);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/ChatSessions/${id}`);
  }

  addMessage(sessionId: number, message: Partial<ChatMessage>): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(
      `/api/ChatSessions/${sessionId}/messages`,
      message
    );
  }
}

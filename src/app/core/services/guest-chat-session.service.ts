import {Injectable} from '@angular/core';
import {ChatMessage} from '../../../interfaces/ChatMessage';
import {GuestChatSession} from '../../../interfaces/GuestChatSession';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class GuestChatSessionService {
  private STORAGE_KEY = 'guestChat';
  private data!: GuestChatSession;
  private nextId = 0;

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.loadFromStorage();
    this.messagesSubject.next([...this.data.messages]);
  }

  private loadFromStorage(): void {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      this.data = JSON.parse(raw);
      this.nextId = this.data.nextId || this.data.messages.length;
    } else {
      this.data = {messages: [], nextId: 0, context: null, sessionName: undefined};
    }
  }

  private persist() {
    this.data.nextId = this.nextId;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    this.messagesSubject.next([...this.data.messages]);
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messages$;
  }

  createNewSessionIfNotExists(meta: { sessionName?: string; context: any | null }): void {
    if (this.sessionExists()) {
      return;
    }

    this.data = {
      messages: [],
      context: meta.context,
      sessionName: meta.sessionName,
      nextId: 0
    };
    this.nextId = 0;
    this.persist();
  }

  addMessage(role: 'user' | 'assistant', content: string) {
    const msg: ChatMessage = {
      id: this.nextId++,
      role,
      content,
      timestamp: new Date().toISOString()
    };
    this.data.messages.push(msg);
    this.persist();
  }

  clearChatSession(): void {
    this.data.messages = [];
    this.data.sessionName = undefined;
    this.data.context = null;
    this.nextId = 0;
    this.persist();
  }

  sessionExists(): boolean {
    return this.data.messages.length > 0 || this.data.sessionName !== undefined;
  }
}

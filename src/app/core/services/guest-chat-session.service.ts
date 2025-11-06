import {Injectable} from '@angular/core';
import {IChatMessage} from '../../../interfaces/IChatMessage';
import {IGuestChatSession} from '../../../interfaces/IGuestChatSession';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class GuestChatSessionService {
  private STORAGE_KEY = 'guestChat';
  private data!: IGuestChatSession;
  private nextId = 0;

  private messagesSubject = new BehaviorSubject<IChatMessage[]>([]);
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

  hasMessages(): boolean {
    return this.data.messages.length > 0;
  }

  getMessages(): Observable<IChatMessage[]> {
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
    const msg: IChatMessage = {
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

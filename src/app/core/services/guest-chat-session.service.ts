import {Injectable} from '@angular/core';
import {ChatMessage} from '../../../interfaces/ChatMessage';
import {GuestChatSession} from '../../../interfaces/GuestChatSession';

@Injectable({providedIn: 'root'})
export class GuestChatSessionService {
  private STORAGE_KEY = 'guestChat';
  private data: GuestChatSession;
  private nextId = 0

  constructor() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    this.data = raw
      ? JSON.parse(raw)
      : {messages: [], nextId: 0, context: null};
    this.persist();
  }

  private persist() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  getMessages(): ChatMessage[] {
    return [...this.data.messages];
  }

  initSession(meta: { sessionName: string; context: any | null }) {
    this.data = {
      messages: [],
      context: meta.context,
    };
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

}

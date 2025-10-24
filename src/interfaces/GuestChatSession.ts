import {ChatMessage} from './ChatMessage';

export interface GuestChatSession {
  nextId: number;
  messages: ChatMessage[];
  sessionName?: string;
  context?: any;
}

import {ChatMessage} from './ChatMessage';

export interface GuestChatSession {
  messages: ChatMessage[];
  context?: any;
}

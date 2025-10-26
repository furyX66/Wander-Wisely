import {ChatSession} from './ChatSession';
import {ChatMessage} from './ChatMessage';

export interface SessionWithMessagesDto {
  session: ChatSession;
  messages: ChatMessage[];
}

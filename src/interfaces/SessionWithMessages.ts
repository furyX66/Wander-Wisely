import {IChatSession} from './IChatSession';
import {IChatMessage} from './IChatMessage';

export interface SessionWithMessagesDto {
  session: IChatSession;
  messages: IChatMessage[];
}

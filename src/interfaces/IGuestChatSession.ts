import {IChatMessage} from './IChatMessage';

export interface IGuestChatSession {
  nextId: number;
  messages: IChatMessage[];
  sessionName?: string;
  context?: any;
}

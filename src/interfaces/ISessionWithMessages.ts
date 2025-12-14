import {IChatSession} from './IChatSession';
import {IChatMessage} from './IChatMessage';
import {IAttraction} from './IAttraction';

export interface SessionWithMessagesDto {
  session: IChatSession;
  messages: IChatMessage[];
  attractions: IAttraction[]
}

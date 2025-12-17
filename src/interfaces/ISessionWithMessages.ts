import {IChatSession} from './IChatSession';
import {IChatMessage} from './IChatMessage';
import {ITrip} from './ITrip';

export interface SessionWithMessagesDto {
  session: IChatSession;
  messages: IChatMessage[];
  trip: ITrip;
}

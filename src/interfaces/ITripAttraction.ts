import {IAttraction} from './IAttraction';

export interface ITripAttraction extends IAttraction{
  orderIndex: number;
  status: string;
}

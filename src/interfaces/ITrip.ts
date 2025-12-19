import { ITripAttraction } from './ITripAttraction';

export interface ITrip {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: string;
  route: ITripAttraction[];
}

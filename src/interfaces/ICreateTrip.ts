export interface ICreateTrip {
  name: string;
  startDate: Date | null,
  endDate: Date | null,
  whereFrom: string| null,
  whereTo: string| null,
  budget: string | null,
}

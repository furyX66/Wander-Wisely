export interface ICreateChatSession {
  userId: number;
  sessionName: string;
  context?: string;
  tripId?: number | null;
}

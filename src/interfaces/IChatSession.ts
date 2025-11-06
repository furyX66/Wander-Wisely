export interface IChatSession {
  id: number;
  userId: number;
  sessionName: string;
  context?: string;
  startedAt: string;
  isActive: boolean;
}

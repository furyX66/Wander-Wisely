export interface IChatMessage {
  id: number;
  chatSessionId?: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

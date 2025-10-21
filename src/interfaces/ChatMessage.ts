export interface ChatMessage {
  id: number;
  chatSessionId?: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

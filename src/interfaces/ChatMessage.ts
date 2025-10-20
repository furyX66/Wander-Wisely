export interface ChatMessage {
  id: number;
  text: string;
  author: 'user' | 'assistant';
}

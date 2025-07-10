export type ChatMessage = {
  id: number;
  text: string;
  author: 'user' | 'assistant';
};

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sessionId: string;
  metadata?: {
    model?: string;
    tokens?: number;
    error?: string;
  };
}

export interface ChatSession {
  id: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentSession: ChatSession | null;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  free: boolean;
}

export interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  autoScroll: boolean;
  soundNotifications: boolean;
  sendOnEnter: boolean;
  apiKey?: string;
}

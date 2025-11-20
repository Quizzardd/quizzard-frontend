export interface IChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  conversationId?: string;
  sessionId?: string;
}

export interface IConversation {
  id: string;
  title: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  sessionId?: string;
}

export interface ISendMessagePayload {
  message: string;
  sessionId?: string;
  userId: string;
}

export interface IMessageContent {
  content: string;
  author: string;
  invocation_id: string;
  timestamp: string;
}

export interface IChatResponse {
  response: string | IMessageContent;
  sessionId: string;
  timestamp?: string;
}

export interface IConversationListResponse {
  conversations: IConversation[];
  total: number;
}

export interface IChatTurn {
  user: {
    text: string;
    timestamp: number;
  } | null;
  agent: {
    text: string;
    timestamp: number;
  } | null;
}

export interface IChatSession {
  id: string;
  lastUpdateTime: number;
  turns: IChatTurn[];
}

export interface IChatHistoryResponse {
  success: boolean;
  session: IChatSession;
}

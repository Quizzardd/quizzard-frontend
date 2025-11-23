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
  groupId?: string;
  educatorName?: string;
  selectedModules?: Array<{ id: string; title: string }>;
}

export interface IMessageContent {
  content: string;
  author: string;
  invocation_id: string;
  timestamp: string | number;
}

export interface IMultipleMessages {
  multipleMessages: IMessageContent[];
}

export interface IChatResponse {
  response: string | IMessageContent | IMultipleMessages;
  sessionId: string;
  timestamp?: number;
  quizId?: string;
  quizAction?: 'created' | 'updated' | null;
  quizUpdatedAt?: number | null;
  isNewSession?: boolean;
}

export interface IConversationListResponse {
  conversations: IConversation[];
  total: number;
}

export interface IChatTurn {
  user: {
    text: string | { message: string; [key: string]: any };
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
  userId: string;
  sessions: IChatSession[];
}

export interface ISingleSessionResponse {
  success: boolean;
  session: IChatSession;
}

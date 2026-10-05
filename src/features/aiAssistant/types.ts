export type AssistantContextType = 'explore' | 'profile' | 'resume' | 'drive';
export type AssistantMode = 'instant' | 'expert';

export interface AssistantContextPayload {
  resumeId?: string;
  activeResumeContext?: Record<string, any> | any;
  selectedJobId?: string;
  driveFileId?: string;
  activeProfileContext?: Record<string, any> | any;
  activeProfileSection?: string;
  enableThinking?: boolean;
  enableDeepSearch?: boolean;
}

export interface AssistantChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  suggestions?: string[];
  relevant?: boolean;
  timestamp: string;
  thought?: string;
  statusBadge?: string;
  isThinking?: boolean;
  isSearching?: boolean;
}

export interface AssistantResponseData {
  relevant: boolean;
  reply: string;
  suggestions: string[];
  mode: AssistantMode;
  intent: string;
  thought?: string;
  statusBadge?: string;
}


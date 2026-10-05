export type RelationshipStage =
  | 'discover'
  | 'connected'
  | 'contacted'
  | 'engaged'
  | 'meeting'
  | 'relationship';

export type ConnectionStatus = 'none' | 'pending' | 'connected' | 'rejected' | 'blocked';
export type ConnectionDegree = '1st' | '2nd' | '3rd+';

export interface InteractionHistoryItem {
  id: string;
  type: 'connection' | 'message' | 'meeting' | 'profile_view' | 'note' | 'stage_change';
  description: string;
  date: string;
}

export interface NetworkContact {
  _id: string;
  userId?: string;
  name: string;
  email?: string;
  phone?: string;
  jobTitle: string;
  company: string;
  location: string;
  industry: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  connectionDegree: ConnectionDegree;
  relationshipStage: RelationshipStage;
  connectionStatus: ConnectionStatus;
  source: string;
  mutualConnections: number;
  recommendationReason?: string;
  isFollowing: boolean;
  isFollower?: boolean;
  tags: string[];
  notes?: string;
  lastInteraction: string;
  interactionHistory: InteractionHistoryItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NetworkSummary {
  totalNetwork: number;
  newConnectionsThisMonth: number;
  contacted: number;
  responded: number;
  meetings: number;
  activeRelationships: number;
  stageCounts: Record<RelationshipStage, number>;
  insights: {
    networkGrowthRate: string;
    responseRate: string;
    followUpsDue: number;
    upcomingMeetings: number;
  };
}

export interface NetworkActivity {
  _id: string;
  contactId?: string;
  contactName: string;
  contactAvatar?: string;
  activityType:
    | 'connection_accepted'
    | 'followed_you'
    | 'profile_view'
    | 'company_changed'
    | 'update_posted'
    | 'connected'
    | 'meeting_completed'
    | 'stage_moved';
  description: string;
  createdAt: string;
}

export interface NetworkFilters {
  search: string;
  stage: RelationshipStage | 'all';
  industry: string;
  location: string;
  source: string;
  sort: 'recent' | 'name' | 'company' | 'mutual' | 'interaction';
}

export interface KanbanStageConfig {
  id: RelationshipStage;
  title: string;
  subtitle: string;
  badgeColor: string;
  borderColor: string;
  headerBg: string;
  accentDot: string;
}

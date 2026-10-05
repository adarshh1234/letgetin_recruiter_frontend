export type FundraisingStage =
  | 'prospect'
  | 'contacted'
  | 'engaged'
  | 'meeting'
  | 'diligence'
  | 'termsheet'
  | 'passed';

export type InvestorTier =
  | 'Tier 1 VC'
  | 'Growth VC'
  | 'Angel Syndicate'
  | 'Family Office'
  | 'Micro VC';

export interface DealActivity {
  id: string;
  date: string;
  type: 'note' | 'email' | 'meeting' | 'call' | 'stage_change' | 'data_room';
  note: string;
  author: string;
}

export interface InvestorDeal {
  _id?: string;
  id?: string;
  startupOrgId?: string;
  investorId?: string;
  fundName: string;
  fundLogoText: string;
  tier: InvestorTier;
  leadPartner: string;
  partnerRole: string;
  partnerEmail: string;
  linkedinUrl?: string;
  stage: FundraisingStage;
  checkSize: number;
  checkSizeText: string;
  focusTags: string[];
  lastTouch: string;
  lastTouchType?: 'email' | 'meeting' | 'deck_view' | 'call' | 'data_room';
  deckViewsCount?: number;
  timeSpentOnDeck?: string;
  notes: string;
  followUpDate?: string;
  probability?: number;
  recentDeal: string;
  activities?: DealActivity[];
}

export interface RoundConfig {
  roundName: string;
  targetAmount: number;
  valuationCap: number;
  instrument: string;
  currency: string;
  closeDate: string;
  startupSlug?: string;
  committedAmount?: number;
  raisedAmount?: number;
  businessModel?: string;
}

export interface Investor {
  _id: string;
  name: string;
  firm: string;
  type: string;
  website?: string;
  location: string;
  countries?: string[];
  sectors: string[];
  stages: string[];
  minTicket?: number;
  maxTicket?: number;
  typicalTicket: string;
  thesis: string;
  description: string;
  portfolioCompanies: string[];
  contactPerson?: {
    name: string;
    role: string;
    email?: string;
    linkedinUrl?: string;
  };
  matchScore?: number;
  matchReasons?: string[];
  potentialMismatches?: string[];
}

export interface FundraisingSummary {
  roundName: string;
  currency: string;
  targetAmount: number;
  raisedAmount: number;
  committedAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  valuationCap: number;
  totalDeals: number;
  stageCounts: Record<FundraisingStage, number>;
  upcomingFollowUps: Array<{
    dealId: string;
    fundName: string;
    leadPartner: string;
    stage: FundraisingStage;
    followUpDate: string;
  }>;
}

export interface StartupProfileResponse {
  organizationId: string;
  name: string;
  website?: string;
  industry?: string;
  sector?: string;
  description?: string;
  location?: string;
  founded?: string;
  employees?: string;
  founders?: string;
  fundraisingProfile: RoundConfig & {
    fundingStage?: string;
    fundraisingStatus?: string;
    minInvestment?: number;
    maxInvestment?: number;
    previousFunding?: number;
    mrr?: number;
    arr?: number;
    revenue?: string;
    growthRate?: string;
    customerCount?: number;
    traction?: string;
    tam?: string;
    sam?: string;
    som?: string;
    competitiveAdvantage?: string;
    pitchDeckUrl?: string;
  };
}

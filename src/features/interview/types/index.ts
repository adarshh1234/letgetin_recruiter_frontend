export type InterviewStage =
  | 'to_schedule'
  | 'upcoming'
  | 'today'
  | 'feedback_pending'
  | 'completed'
  | 'cancelled';

export type InterviewType = 'live_video' | 'ai_interview' | 'onsite';

export interface Interviewer {
  name: string;
  role: string;
  email?: string;
  avatar?: string;
}

export interface AiQuestion {
  id: string;
  question: string;
  category: string;
  expectedAnswer?: string;
  difficulty?: 'junior' | 'mid' | 'senior' | 'lead';
  criteria?: string[];
  greenFlags?: string[];
  redFlags?: string[];
}

export interface AiScorecard {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'Reject';
  evaluationDate?: string;
}

export interface Interview {
  _id: string;
  id?: string;
  userId: string;
  candidateName: string;
  candidateEmail: string;
  candidateAvatar?: string;
  position: string;
  department: string;
  roundName: string;
  stage: InterviewStage;
  type: InterviewType;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  durationMinutes: number;
  platform: 'LetGetIn Room' | 'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'On-Site';
  meetingLink: string;
  roomCode?: string;
  interviewers: Interviewer[];
  aiQuestions?: AiQuestion[];
  score?: number; // 1-5
  feedbackNotes?: string;
  aiScorecard?: AiScorecard;
  linkedTaskId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInterviewInput {
  candidateName: string;
  candidateEmail: string;
  candidateAvatar?: string;
  position: string;
  department?: string;
  roundName?: string;
  stage?: InterviewStage;
  type?: InterviewType;
  date: string;
  time: string;
  durationMinutes?: number;
  platform?: 'LetGetIn Room' | 'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'On-Site';
  meetingLink?: string;
  roomCode?: string;
  interviewers?: Interviewer[];
}

export interface GenerateAiQuestionsInput {
  role: string;
  skills?: string[];
  experienceLevel?: 'junior' | 'mid' | 'senior' | 'lead';
  focusAreas?: string[];
  count?: number;
}

export interface EvaluateSessionInput {
  role: string;
  questionsAndAnswers: { question: string; answer: string }[];
  interviewId?: string;
}

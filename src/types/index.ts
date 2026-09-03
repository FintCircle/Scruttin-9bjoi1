export type ProjectStage = 'Idea' | 'Validating' | 'Building' | 'Testing' | 'Launched' | 'Growing';

export type UpdateType = 'Update' | 'Problem' | 'Decision' | 'Ask' | 'Milestone' | 'Lesson' | 'Launch';

export type Industry =
  | 'Technology'
  | 'Food & Beverage'
  | 'Fashion'
  | 'Retail'
  | 'Finance'
  | 'Education'
  | 'Health'
  | 'SaaS'
  | 'Media'
  | 'E-commerce'
  | 'Services'
  | 'Manufacturing'
  | 'Other';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  expertise: string[];
  acceptingQuestions: boolean;
  askTopics: string[];
  projectIds: string[];
  answeredQuestions: number;
  articlesCount: number;
  taggedCount: number;
}

export interface Project {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  description: string;
  founderId: string;
  founderName: string;
  founderAvatar: string;
  industry: Industry;
  location: string;
  website?: string;
  stage: ProjectStage;
  startedDate: string;
  tagAlongCount: number;
  isTaggedAlong?: boolean;
  lookingFor: string[];
  updates: ProjectUpdate[];
  timeline: TimelineEvent[];
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  projectName: string;
  projectLogo: string;
  type: UpdateType;
  content: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  emoji: string;
  label: string;
}

export interface QAQuestion {
  id: string;
  question: string;
  askedBy: string;
  askedByAvatar: string;
  category: string;
  timestamp: string;
  answers: QAAnswer[];
  votes: number;
}

export interface QAAnswer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorProject?: string;
  type: 'voice' | 'text';
  content: string;
  duration?: string;
  timestamp: string;
  votes: number;
}

export interface ProfileQuestion {
  id: string;
  toUserId: string;
  fromName: string;
  question: string;
  isAnswered: boolean;
  answer?: {
    type: 'voice' | 'text';
    content: string;
    duration?: string;
  };
  timestamp: string;
  isPublic: boolean;
}

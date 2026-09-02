export type RoleEnum = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: RoleEnum;
  targetCompanyId?: string;
  targetRoleId?: string;
  currentStreak?: number;
  longestStreak?: number;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  active: boolean;
}

export interface JobRole {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  active: boolean;
}

export interface SelectionRound {
  id: string;
  roleId: string;
  name: string;
  roundOrder: number;
}

export interface Topic {
  id: string;
  name: string;
  category: string;
}

export type QuestionType = 'MCQ' | 'CODING' | 'TEXT';
export type QuestionCategory = 'PYQ_STYLE' | 'PRACTICE' | 'INTERVIEW' | 'MOCK_TEST' | 'CONTEST';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface QuestionOption {
  id: string;
  optionText: string;
  isCorrect?: boolean;
  explanation?: string;
}

export interface CodingTestCase {
  id: string;
  inputData?: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  questionType: QuestionType;
  category: QuestionCategory;
  difficulty: Difficulty;
  companyId?: string;
  companyName?: string;
  roleId?: string;
  roleName?: string;
  roundId?: string;
  roundName?: string;
  topicId: string;
  topicName?: string;
  year?: number;
  starterCode?: string;
  solution?: string;
  constraints?: string;
  inputFormat?: string;
  outputFormat?: string;
  explanation?: string;
  options?: QuestionOption[];
  sampleTestCases?: CodingTestCase[];
  createdAt?: string;
}

export interface AttemptResult {
  attemptId: string;
  questionId: string;
  isCorrect: boolean;
  score: number;
  correctOptionId?: string;
  explanation?: string;
  solution?: string;
}

export interface Mistake {
  question: Question;
  totalAttempts: number;
  lastResult: boolean;
  isMastered: boolean;
  lastAttemptedAt: string;
}

export interface TestCaseResult {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  isHidden: boolean;
}

export interface CodeExecutionResult {
  status: string; // ACCEPTED, WRONG_ANSWER, COMPILATION_ERROR, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED
  stdout?: string;
  stderr?: string;
  compileOutput?: String;
  runtimeMs?: number;
  memoryKb?: number;
  testCasesPassed?: number;
  totalTestCases?: number;
  testCaseResults?: TestCaseResult[];
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: 'UPCOMING' | 'LIVE' | 'ENDED';
  questions?: Question[];
}

export interface LeaderboardEntry {
  id: string;
  contestId?: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  rank: number;
  score: number;
  accuracy: number;
  totalTimeSeconds: number;
}

export interface Skill {
  id: string;
  topicId: string;
  topicName: string;
  category: string;
  accuracyPercentage: number;
  questionsAttempted: number;
  questionsSolved: number;
  masteryScore: number;
}

export interface ProgressOverview {
  readinessScore: number | null;
  readinessLabel: string;
  totalAttempted: number;
  totalSolved: number;
  overallAccuracy: number;
  codingSuccessRate: number;
  currentStreak: number;
  weakestTopicName?: string;
  strongestTopicName?: string;
  skills: Skill[];
}

export interface Recommendation {
  id: string;
  topicId?: string;
  topicName?: string;
  title: string;
  description: string;
  recommendationType: string;
}

export interface InterviewEvaluation {
  interviewId: string;
  overallScore: number;
  communicationScore: number;
  clarityScore: number;
  relevanceScore: number;
  confidenceScore: number;
  professionalismScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  detailedSummary: string;
}

export interface InterviewTurnResponse {
  interviewId: string;
  nextQuestionText: string;
  feedbackOnLastAnswer?: string;
  communicationScore?: number;
  relevanceScore?: number;
  confidenceScore?: number;
  isCompleted: boolean;
  finalEvaluation?: InterviewEvaluation;
}

export interface ResumeAnalysis {
  id: string;
  resumeId: string;
  fileName: string;
  overallMatchScore: number;
  strongSkills: string[];
  missingSkills: string[];
  weakAreas: string[];
  recommendations: string[];
}

export interface RoadmapItem {
  id: string;
  dayNumber: number;
  topicName: string;
  taskDescription: string;
  isCompleted: boolean;
}

export interface Roadmap {
  id: string;
  companyId?: string;
  companyName: string;
  roleId?: string;
  roleTitle: string;
  durationDays: number;
  items: RoadmapItem[];
}

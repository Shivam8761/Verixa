import axios from 'axios';
import {
  AuthResponse,
  User,
  Company,
  JobRole,
  SelectionRound,
  Topic,
  Question,
  AttemptResult,
  Mistake,
  CodeExecutionResult,
  Contest,
  LeaderboardEntry,
  ProgressOverview,
  Skill,
  Recommendation,
  InterviewTurnResponse,
  ResumeAnalysis,
  Roadmap,
} from '../types';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('verixa_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await API.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },
  register: async (email: string, password: string, fullName: string, targetCompanyId?: string, targetRoleId?: string): Promise<AuthResponse> => {
    const res = await API.post<AuthResponse>('/auth/register', { email, password, fullName, targetCompanyId, targetRoleId });
    return res.data;
  },
  getCurrentUser: async (): Promise<User> => {
    const res = await API.get<User>('/users/me');
    return res.data;
  },
};

export const companyService = {
  getCompanies: async (): Promise<Company[]> => {
    const res = await API.get<Company[]>('/companies');
    return res.data;
  },
  getRolesForCompany: async (companyId: string): Promise<JobRole[]> => {
    const res = await API.get<JobRole[]>(`/companies/${companyId}/roles`);
    return res.data;
  },
  getRoundsForRole: async (roleId: string): Promise<SelectionRound[]> => {
    const res = await API.get<SelectionRound[]>(`/roles/${roleId}/rounds`);
    return res.data;
  },
};

export const topicService = {
  getTopics: async (category?: string): Promise<Topic[]> => {
    const res = await API.get<Topic[]>('/topics', { params: { category } });
    return res.data;
  },
};

export const questionService = {
  getQuestions: async (params?: { companyId?: string; roleId?: string; roundId?: string; topicId?: string; difficulty?: string; questionType?: string; category?: string }): Promise<Question[]> => {
    const res = await API.get<Question[]>('/questions', { params });
    return res.data;
  },
  getGeneralDsaQuestions: async (difficulty?: string): Promise<Question[]> => {
    const res = await API.get<Question[]>('/dsa/questions', { params: { difficulty } });
    return res.data;
  },
  getQuestionById: async (id: string): Promise<Question> => {
    const res = await API.get<Question>(`/questions/${id}`);
    return res.data;
  },
  attemptQuestion: async (questionId: string, selectedOptionId?: string, textAnswer?: string, timeSpentSeconds = 30): Promise<AttemptResult> => {
    const res = await API.post<AttemptResult>(`/questions/${questionId}/attempt`, { selectedOptionId, textAnswer, timeSpentSeconds });
    return res.data;
  },
  getMistakes: async (): Promise<Mistake[]> => {
    const res = await API.get<Mistake[]>('/mistakes');
    return res.data;
  },
};

export const codeService = {
  executeCode: async (language: string, sourceCode: string, questionId?: string, inputData?: string): Promise<CodeExecutionResult> => {
    const res = await API.post<CodeExecutionResult>('/code/execute', { language, sourceCode, questionId, inputData });
    return res.data;
  },
  submitCode: async (questionId: string, language: string, sourceCode: string): Promise<CodeExecutionResult> => {
    const res = await API.post<CodeExecutionResult>('/code/submit', { questionId, language, sourceCode });
    return res.data;
  },
};

export const contestService = {
  getContests: async (): Promise<Contest[]> => {
    const res = await API.get<Contest[]>('/contests');
    return res.data;
  },
  getContestById: async (id: string): Promise<Contest> => {
    const res = await API.get<Contest>(`/contests/${id}`);
    return res.data;
  },
  submitContest: async (contestId: string, submissions: { questionId: string; answer?: string; selectedOptionId?: string }[]): Promise<Contest> => {
    const res = await API.post<Contest>(`/contests/${contestId}/submit`, { submissions });
    return res.data;
  },
  getLeaderboard: async (contestId?: string): Promise<LeaderboardEntry[]> => {
    const url = contestId ? `/leaderboard/contest/${contestId}` : '/leaderboard';
    const res = await API.get<LeaderboardEntry[]>(url);
    return res.data;
  },
};

export const progressService = {
  getProgress: async (): Promise<ProgressOverview> => {
    const res = await API.get<ProgressOverview>('/progress');
    return res.data;
  },
  getSkills: async (): Promise<Skill[]> => {
    const res = await API.get<Skill[]>('/skills');
    return res.data;
  },
  getRecommendations: async (): Promise<Recommendation[]> => {
    const res = await API.get<Recommendation[]>('/recommendations');
    return res.data;
  },
};

export const aiService = {
  chat: async (prompt: string, questionId?: string, contextType?: string) => {
    const res = await API.post<{ responseText: string; actionSuggestion?: string }>('/ai/chat', { prompt, questionId, contextType });
    return res.data;
  },
  startInterview: async (companyId?: string, roleId?: string, roundType = 'HR'): Promise<InterviewTurnResponse> => {
    const res = await API.post<InterviewTurnResponse>('/interviews', { companyId, roleId, roundType });
    return res.data;
  },
  answerInterviewQuestion: async (interviewId: string, questionText: string, answerText: string): Promise<InterviewTurnResponse> => {
    const res = await API.post<InterviewTurnResponse>(`/interviews/${interviewId}/answer`, { questionText, answerText });
    return res.data;
  },
  completeInterview: async (interviewId: string): Promise<InterviewTurnResponse> => {
    const res = await API.post<InterviewTurnResponse>(`/interviews/${interviewId}/complete`);
    return res.data;
  },
};

export const resumeService = {
  analyzeResume: async (file: File, companyId?: string, roleId?: string): Promise<ResumeAnalysis> => {
    const formData = new FormData();
    formData.append('file', file);
    if (companyId) formData.append('companyId', companyId);
    if (roleId) formData.append('roleId', roleId);
    const res = await API.post<ResumeAnalysis>('/resume/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export const roadmapService = {
  createPlan: async (companyId?: string, roleId?: string, durationDays = 30, mode = 'COMPLETE'): Promise<Roadmap> => {
    const res = await API.post<Roadmap>('/preparation-plans', { companyId, roleId, durationDays, mode });
    return res.data;
  },
  getMyPlans: async (): Promise<Roadmap[]> => {
    const res = await API.get<Roadmap[]>('/preparation-plans/me');
    return res.data;
  },
};

export const adminService = {
  createQuestion: async (data: any): Promise<Question> => {
    const res = await API.post<Question>('/admin/questions', data);
    return res.data;
  },
};

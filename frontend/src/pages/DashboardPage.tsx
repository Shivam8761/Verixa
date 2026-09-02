import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressService, contestService } from '../services/api';
import { ProgressOverview, Recommendation, Contest } from '../types';
import { 
  Building2, 
  Target, 
  Flame, 
  BarChart3, 
  Sparkles, 
  Trophy, 
  Bot, 
  Code2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Compass
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressOverview | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [progData, recData, contestData] = await Promise.all([
          progressService.getProgress(),
          progressService.getRecommendations(),
          contestService.getContests(),
        ]);
        setProgress(progData);
        setRecommendations(recData);
        setContests(contestData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 text-sm">Loading your placement dashboard...</p>
      </div>
    );
  }

  const liveContest = contests.find(c => c.status === 'LIVE') || contests[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-surface-900 via-slate-900 to-blue-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
            <Building2 className="w-4 h-4" />
            <span>Target Company: TCS — Ninja Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.fullName || 'Candidate'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Keep up your daily momentum. You are currently on a <span className="text-amber-400 font-bold">{progress?.currentStreak || 1} day active streak</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/company-prep"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center space-x-2"
          >
            <Compass className="w-4 h-4" />
            <span>Continue Preparation</span>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Readiness Score Card */}
        <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Interview Readiness</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>

          <div className="space-y-1">
            {progress?.readinessScore !== null ? (
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-white">{progress?.readinessScore}</span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>
            ) : (
              <div className="text-lg font-bold text-amber-400">Not enough data yet</div>
            )}
            <div className="text-xs font-semibold text-blue-400">{progress?.readinessLabel}</div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Deterministic formula: Technical (25%), Coding (25%), Aptitude (15%), HR (15%), Contests (10%), Streak (10%).
          </p>

          <Link to="/progress" className="text-xs font-semibold text-blue-400 hover:underline flex items-center space-x-1 pt-1">
            <span>View Score Breakdown</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Recommended Next Step Card */}
        <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recommended Next Step</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>

          {recommendations.length > 0 ? (
            <div className="space-y-2">
              <h3 className="font-bold text-white text-base">{recommendations[0].title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{recommendations[0].description}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Complete 3 questions to unlock personalized AI recommendations.</p>
          )}

          <Link
            to="/company-prep"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:underline pt-1"
          >
            <span>Start Action</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Weakest Topic Card */}
        <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Focus Area (Weakest)</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-white">
              {progress?.weakestTopicName || 'Arrays & Aptitude'}
            </div>
            <div className="text-xs text-slate-400">Needs additional practice & review</div>
          </div>

          <Link
            to="/dsa"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-400 hover:underline pt-1"
          >
            <span>Practice Weak Topic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Launch Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launch AI Interview */}
        <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white">AI HR Mock Interview</h3>
              <p className="text-xs text-slate-400">Voice-supported behavioral practice</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Practice TCS Ninja HR questions with real-time AI follow-ups and turn-by-turn communication scores.
          </p>

          <Link
            to="/ai-interview"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
          >
            <span>Launch Mock Interview</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Real Code Compiler */}
        <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white">DSA & Coding Compiler</h3>
              <p className="text-xs text-slate-400">Monaco Editor + Sandboxed Execution</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Solve problems using real Java compilation against hidden test cases and performance constraints.
          </p>

          <Link
            to="/dsa"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
          >
            <span>Solve Coding Problems</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Weekly Contest */}
        <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white">Weekly Placement Contest</h3>
              <p className="text-xs text-slate-400">Live timed ranking leaderboard</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {liveContest ? liveContest.title : 'Weekly Placement Challenge #1'}
          </p>

          <Link
            to="/contests"
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
          >
            <span>Enter Contest Arena</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

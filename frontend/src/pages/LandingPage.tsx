import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Code2, 
  Trophy, 
  Bot, 
  FileCheck2, 
  BarChart3, 
  ArrowRight,
  CheckCircle2,
  Cpu,
  Target
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Target className="w-3.5 h-3.5" />
          <span>Real Target Company Placement Engine</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Prepare smarter. Practice realistically.<br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            Get interview ready.
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Master company-specific selection rounds, execute real code in Monaco editor, benchmark on weekly leaderboards, and take AI-powered HR interviews.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <span>Start Preparing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dsa"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>Explore DSA</span>
          </Link>
        </div>
      </section>

      {/* Target Companies Section */}
      <section className="border border-slate-800/80 rounded-2xl bg-surface-900/50 p-8 text-center space-y-6">
        <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Target Recruitment Profiles</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-900 border border-blue-500/30 text-left space-y-1">
            <div className="text-lg font-bold text-white flex items-center justify-between">
              <span>TCS</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold">Active</span>
            </div>
            <div className="text-xs text-slate-400">Ninja & Digital Profile</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-left space-y-1 opacity-70">
            <div className="text-lg font-bold text-slate-300">Infosys</div>
            <div className="text-xs text-slate-500">System Engineer</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-left space-y-1 opacity-70">
            <div className="text-lg font-bold text-slate-300">Accenture</div>
            <div className="text-xs text-slate-500">ASE & FSE</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-left space-y-1 opacity-70">
            <div className="text-lg font-bold text-slate-300">Capgemini</div>
            <div className="text-xs text-slate-500">Analyst Profile</div>
          </div>
        </div>
      </section>

      {/* Product Pillars Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How Verixa Prepares You</h2>
          <p className="text-slate-400 text-sm">Every core feature shown in Verixa is backed by real execution and data algorithms.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Company Round Prep</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Target Aptitude, Verbal, Technical, and HR rounds for TCS Ninja. Mode A for specific rounds or Mode B for 30-day complete roadmaps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Real Code Compiler</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Write Java code in Monaco Editor with custom input testing, hidden test case verification, runtime limits, and memory diagnosis.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">AI HR Mock Interview</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Engage in multi-turn conversational interviews with browser voice support. Get dynamic follow-up questions and full scorecard feedback.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Weekly Contests</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Participate in timed weekly challenges. Ranks are computed live from user submission speed, accuracy, and total points.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">PDF Resume AI Analysis</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload your PDF resume to extract skills using Apache PDFBox. Match skills against TCS Ninja job criteria and spot weak gaps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Readiness Score</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Track your deterministic Readiness Score calculated from technical accuracy, coding success, HR mock interviews, and consistency.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

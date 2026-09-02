import React, { useEffect, useState } from 'react';
import { progressService } from '../services/api';
import { ProgressOverview, Skill } from '../types';
import { BarChart3, Target, CheckCircle2, TrendingUp, Cpu, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ProgressPage: React.FC = () => {
  const [progress, setProgress] = useState<ProgressOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await progressService.getProgress();
        setProgress(data);
      } catch (err) {
        console.error('Failed to fetch progress overview', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading || !progress) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading performance analytics...</div>;
  }

  const chartData = progress.skills.map((s) => ({
    name: s.topicName,
    Accuracy: s.accuracyPercentage,
    Mastery: s.masteryScore,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
          <BarChart3 className="w-4 h-4" />
          <span>Performance & Skill Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Interview Readiness & Analytics</h1>
        <p className="text-sm text-slate-400">Detailed breakdown of topic mastery scores, accuracy trends, and readiness criteria.</p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Readiness Score</span>
          <div className="text-2xl font-extrabold text-white">
            {progress.readinessScore !== null ? `${progress.readinessScore} / 100` : 'No Data'}
          </div>
          <span className="text-xs text-blue-400 font-semibold">{progress.readinessLabel}</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Solved</span>
          <div className="text-2xl font-extrabold text-emerald-400">{progress.totalSolved}</div>
          <span className="text-xs text-slate-400">Out of {progress.totalAttempted} attempted</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Overall Accuracy</span>
          <div className="text-2xl font-extrabold text-blue-400">{progress.overallAccuracy}%</div>
          <span className="text-xs text-slate-400">Across all topics</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Coding Success</span>
          <div className="text-2xl font-extrabold text-purple-400">{progress.codingSuccessRate}%</div>
          <span className="text-xs text-slate-400">Accepted test cases</span>
        </div>
      </div>

      {/* Recharts Bar Chart View */}
      {chartData.length > 0 && (
        <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white">Topic Mastery Breakdown</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="Mastery" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Topic Skills Table */}
      <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-4 overflow-x-auto">
        <h2 className="text-lg font-bold text-white">Detailed Topic Skills Matrix</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="pb-3 px-4">Topic</th>
              <th className="pb-3 px-4">Category</th>
              <th className="pb-3 px-4">Accuracy</th>
              <th className="pb-3 px-4">Questions Solved</th>
              <th className="pb-3 px-4">Mastery Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {progress.skills.map((s) => (
              <tr key={s.id}>
                <td className="py-4 px-4 font-bold text-white">{s.topicName}</td>
                <td className="py-4 px-4 text-xs font-semibold text-slate-400">{s.category}</td>
                <td className="py-4 px-4 font-mono text-emerald-400">{s.accuracyPercentage}%</td>
                <td className="py-4 px-4 text-slate-300">{s.questionsSolved} / {s.questionsAttempted}</td>
                <td className="py-4 px-4 font-mono font-bold text-blue-400">{s.masteryScore} / 100</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

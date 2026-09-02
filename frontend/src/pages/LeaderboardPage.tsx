import React, { useEffect, useState } from 'react';
import { contestService } from '../services/api';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Clock, Award } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await contestService.getLeaderboard();
        setEntries(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
          <Trophy className="w-4 h-4" />
          <span>Real Contest Rankings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Global Placement Leaderboard</h1>
        <p className="text-sm text-slate-400">Rankings derived directly from real database contest submissions and practice accuracy.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading leaderboard standings...</div>
      ) : (
        <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 px-4">Rank</th>
                <th className="pb-3 px-4">Candidate</th>
                <th className="pb-3 px-4">Score</th>
                <th className="pb-3 px-4">Accuracy</th>
                <th className="pb-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-bold">
                    {e.rank === 1 ? (
                      <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-flex items-center justify-center font-extrabold text-xs">
                        🥇 1
                      </span>
                    ) : e.rank === 2 ? (
                      <span className="w-7 h-7 rounded-lg bg-slate-400/20 text-slate-300 border border-slate-400/30 inline-flex items-center justify-center font-extrabold text-xs">
                        🥈 2
                      </span>
                    ) : e.rank === 3 ? (
                      <span className="w-7 h-7 rounded-lg bg-amber-700/20 text-amber-600 border border-amber-700/30 inline-flex items-center justify-center font-extrabold text-xs">
                        🥉 3
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono pl-2">#{e.rank}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-bold text-white">
                    {e.userFullName}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400">
                    {e.score} pts
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-300">
                    {e.accuracy}%
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-400">
                    {Math.floor(e.totalTimeSeconds / 60)} mins
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

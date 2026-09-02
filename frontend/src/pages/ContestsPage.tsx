import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contestService } from '../services/api';
import { Contest } from '../types';
import { Trophy, Clock, Play, CheckCircle2, ArrowRight } from 'lucide-react';

export const ContestsPage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const data = await contestService.getContests();
        setContests(data);
      } catch (err) {
        console.error('Failed to fetch contests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
            <Trophy className="w-4 h-4" />
            <span>Weekly Placement Arena</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Weekly Placement Challenges</h1>
          <p className="text-sm text-slate-400">Compete in real-time placement simulation tests and earn real rank positions.</p>
        </div>

        <Link
          to="/leaderboard"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center space-x-1.5"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Global Leaderboard</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading contests...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {contests.map((c) => (
            <div key={c.id} className="p-6 rounded-2xl bg-surface-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    c.status === 'LIVE'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {c.status === 'LIVE' ? 'LIVE NOW' : c.status}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Duration: {c.durationMinutes} Minutes</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{c.title}</h3>
                <p className="text-xs text-slate-400 max-w-2xl">{c.description}</p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <Link
                  to={`/contests/${c.id}`}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/25 flex items-center space-x-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Enter Contest Arena</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

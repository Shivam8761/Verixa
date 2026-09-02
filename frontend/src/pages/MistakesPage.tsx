import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { questionService } from '../services/api';
import { Mistake } from '../types';
import { BookOpen, RefreshCw, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const MistakesPage: React.FC = () => {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMistakes = async () => {
      try {
        const data = await questionService.getMistakes();
        setMistakes(data);
      } catch (err) {
        console.error('Failed to fetch mistakes notebook', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMistakes();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400">
          <BookOpen className="w-4 h-4" />
          <span>Personal Revision Notebook</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">My Mistakes Notebook</h1>
        <p className="text-sm text-slate-400">Failed attempts automatically appear here for retry, revision, and mastery verification.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading mistake notebook...</div>
      ) : mistakes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-surface-900 border border-slate-800 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Unmastered Mistakes!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Great job! You have solved all attempted questions correctly or haven't made any mistakes yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {mistakes.map((m, idx) => (
            <div key={m.question.id || idx} className="p-6 rounded-2xl bg-surface-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Failed Attempt ({m.totalAttempts} Attempts)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {m.question.topicName || 'General'}
                  </span>
                  {m.isMastered && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mastered</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base">{m.question.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{m.question.description}</p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <Link
                  to={m.question.questionType === 'CODING' ? `/dsa/problem/${m.question.id}` : `/practice/${m.question.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Problem</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

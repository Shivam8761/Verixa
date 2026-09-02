import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contestService } from '../services/api';
import { Contest, Question } from '../types';
import { Trophy, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContestArenaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contest, setContest] = useState<Contest | null>(null);
  const [answers, setAnswers] = useState<Record<string, { selectedOptionId?: string; answer?: string }>>({});
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 60 mins countdown
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContestData = async () => {
      if (!id) return;
      try {
        const c = await contestService.getContestById(id);
        setContest(c);
        setTimeLeft((c.durationMinutes || 60) * 60);
      } catch (err) {
        console.error('Failed to load contest arena', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContestData();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], selectedOptionId: optionId },
    }));
  };

  const handleTextAnswer = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], answer: text },
    }));
  };

  const handleSubmitContest = async () => {
    if (!id || !contest?.questions) return;
    setSubmitting(true);

    const submissionPayload = contest.questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: answers[q.id]?.selectedOptionId,
      answer: answers[q.id]?.answer,
    }));

    try {
      await contestService.submitContest(id, submissionPayload);
      navigate(`/leaderboard`);
    } catch (err) {
      console.error('Failed to submit contest', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !contest) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading contest arena...</div>;
  }

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Contest Top Bar */}
      <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Live Contest Arena</div>
          <h1 className="text-2xl font-extrabold text-white">{contest.title}</h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-rose-400 font-mono text-lg font-bold bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20">
            <Clock className="w-5 h-5" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <button
            onClick={handleSubmitContest}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : 'Submit Contest'}</span>
          </button>
        </div>
      </div>

      {/* Contest Question Arena */}
      <div className="space-y-6">
        {contest.questions?.map((q, qIdx) => (
          <div key={q.id} className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {qIdx + 1} of {contest.questions?.length} ({q.questionType})
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                10 Marks
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">{q.title}</h3>
              <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{q.description}</p>
            </div>

            {q.questionType === 'MCQ' && q.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id]?.selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`p-4 rounded-xl text-left text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {opt.optionText}
                    </button>
                  );
                })}
              </div>
            )}

            {q.questionType !== 'MCQ' && (
              <textarea
                value={answers[q.id]?.answer || ''}
                onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                placeholder="Type your solution / code here..."
                className="w-full h-32 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

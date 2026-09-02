import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { questionService, aiService } from '../services/api';
import { Question, AttemptResult } from '../types';
import { BookOpen, CheckCircle2, XCircle, ArrowLeft, ArrowRight, HelpCircle, Bot, Sparkles, Clock, RefreshCw } from 'lucide-react';

export const PracticeQuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [attemptResult, setAttemptResult] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // AI Chat Drawer State
  const [showAiHelp, setShowAiHelp] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) return;
      setLoading(true);
      setAttemptResult(null);
      setSelectedOptionId(null);
      setTextAnswer('');
      try {
        const q = await questionService.getQuestionById(id);
        if (q.questionType === 'CODING') {
          navigate(`/dsa/problem/${q.id}`, { replace: true });
          return;
        }
        setQuestion(q);
      } catch (err) {
        console.error('Failed to fetch question details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id, navigate]);

  const handleSubmitAttempt = async () => {
    if (!id || (!selectedOptionId && !textAnswer.trim())) return;
    setSubmitting(true);
    try {
      const res = await questionService.attemptQuestion(id, selectedOptionId || undefined, textAnswer || undefined, 30);
      setAttemptResult(res);
    } catch (err) {
      console.error('Failed to submit question attempt', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAskAi = async () => {
    if (!id || !aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await aiService.chat(aiPrompt, id, 'PRACTICE_HINT');
      setAiReply(res.responseText);
    } catch (err) {
      setAiReply('Sorry, VERIXA AI could not process your request at this moment.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading || !question) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading practice question...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <Link to="/company-prep" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
              <span>{question.category}</span>
              <span>•</span>
              <span>{question.topicName || 'General Topic'}</span>
            </div>
            <h1 className="text-xl font-bold text-white">{question.title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
            question.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            question.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {question.difficulty}
          </span>
          <button
            onClick={() => setShowAiHelp(!showAiHelp)}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 font-semibold text-xs hover:bg-purple-600/30 transition-all flex items-center space-x-1.5"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>AI Hint</span>
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-6">
        <div className="space-y-2">
          <h2 className="text-base font-bold text-white">Question Statement</h2>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
            {question.description}
          </p>
        </div>

        {/* MCQ Options Grid */}
        {question.questionType === 'MCQ' && question.options && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Option</h3>
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOptionId === opt.id;
                const isSubmitted = attemptResult !== null;
                const isCorrectOpt = opt.id === attemptResult?.correctOptionId;

                let optStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                if (isSubmitted) {
                  if (isCorrectOpt) {
                    optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                  } else if (isSelected && !attemptResult.isCorrect) {
                    optStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-lg shadow-blue-500/10';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isSubmitted}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`p-4 rounded-xl text-left text-xs transition-all border flex items-center justify-between ${optStyle}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt.optionText}</span>
                    </div>

                    {isSubmitted && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {isSubmitted && isSelected && !attemptResult.isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Text Answer Input */}
        {question.questionType === 'TEXT' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Explanation / Answer</h3>
            <textarea
              value={textAnswer}
              disabled={attemptResult !== null}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your response here..."
              className="w-full h-32 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* Action Controls */}
        {!attemptResult ? (
          <button
            onClick={handleSubmitAttempt}
            disabled={submitting || (!selectedOptionId && !textAnswer.trim())}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Evaluating...' : 'Submit Answer'}</span>
          </button>
        ) : (
          /* Result Feedback Section */
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
              attemptResult.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {attemptResult.isCorrect ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
              <div className="space-y-1">
                <h4 className="font-bold text-sm">
                  {attemptResult.isCorrect ? 'Correct Answer! (+10 Marks)' : 'Incorrect Answer'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {attemptResult.explanation || question.explanation || 'Review solution details below.'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setAttemptResult(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center space-x-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <Link
                to="/company-prep"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center space-x-1.5 shadow-lg shadow-blue-500/20"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Help Drawer */}
      {showAiHelp && (
        <div className="p-6 rounded-2xl bg-surface-900 border border-purple-500/30 space-y-4">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>VERIXA AI Assistant — Instant Question Guidance</span>
          </div>

          <div className="space-y-2">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask for a hint, concept explanation, or approach (e.g. 'Give me a subtle hint' or 'Explain formula used')..."
              className="w-full h-20 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
            />

            <button
              onClick={handleAskAi}
              disabled={aiLoading || !aiPrompt.trim()}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {aiLoading ? 'Generating AI Response...' : 'Ask AI'}
            </button>
          </div>

          {aiReply && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line">
              <span className="font-bold text-purple-400 block mb-1">VERIXA AI Guidance:</span>
              {aiReply}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

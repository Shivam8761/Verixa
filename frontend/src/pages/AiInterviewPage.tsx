import React, { useState } from 'react';
import { aiService } from '../services/api';
import { InterviewTurnResponse, InterviewEvaluation } from '../types';
import { Bot, Mic, MicOff, Send, Volume2, CheckCircle2, Award, ArrowRight, Building2, AlertCircle } from 'lucide-react';

export const AiInterviewPage: React.FC = () => {
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [transcript, setTranscript] = useState<{ sender: 'AI' | 'USER'; text: string }[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [turnResponse, setTurnResponse] = useState<InterviewTurnResponse | null>(null);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [loading, setLoading] = useState(false);

  // Web Speech API Initialization
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await aiService.startInterview('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'HR');
      setInterviewId(res.interviewId);
      setCurrentQuestion(res.nextQuestionText);
      setTranscript([{ sender: 'AI', text: res.nextQuestionText }]);
      speakText(res.nextQuestionText);
    } catch (err) {
      console.error('Failed to start interview', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Please use text input fallback.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setUserAnswer((prev) => (prev ? prev + ' ' + spokenText : spokenText));
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleSubmitAnswer = async () => {
    if (!interviewId || !userAnswer.trim()) return;
    setLoading(true);

    const updatedTranscript = [...transcript, { sender: 'USER' as const, text: userAnswer }];
    setTranscript(updatedTranscript);

    const questionAsked = currentQuestion;
    const answerSubmitted = userAnswer;
    setUserAnswer('');

    try {
      const res = await aiService.answerInterviewQuestion(interviewId, questionAsked, answerSubmitted);
      setTurnResponse(res);

      if (res.isCompleted && res.finalEvaluation) {
        setEvaluation(res.finalEvaluation);
      } else {
        setCurrentQuestion(res.nextQuestionText);
        setTranscript((prev) => [...prev, { sender: 'AI', text: res.nextQuestionText }]);
        speakText(res.nextQuestionText);
      }
    } catch (err) {
      console.error('Failed to process interview answer', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
            <Bot className="w-4 h-4" />
            <span>Voice & Text AI HR Mock Interview</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">AI HR Mock Interview</h1>
          <p className="text-sm text-slate-400">Target Profile: TCS Ninja Cadre — Behavioral & HR Round</p>
        </div>

        {interviewId && !evaluation && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => speakText(currentQuestion)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1"
              title="Repeat Audio"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        )}
      </div>

      {!interviewId ? (
        /* Start Interview Card */
        <div className="p-8 rounded-2xl bg-surface-900 border border-slate-800 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Bot className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-white">Ready for your TCS HR Interview?</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              The AI interviewer will ask realistic HR & behavioral questions. Respond using your microphone or text input.
            </p>
          </div>

          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all inline-flex items-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Initializing Session...' : 'Start AI Interview Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : evaluation ? (
        /* Final Evaluation Scorecard */
        <div className="p-8 rounded-2xl bg-surface-900 border border-slate-800 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Interview Evaluation Scorecard</h2>
            <div className="text-3xl font-extrabold text-emerald-400">{evaluation.overallScore} / 100</div>
          </div>

          {/* Metric Ratings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Communication</span>
              <div className="text-lg font-bold text-white">{evaluation.communicationScore}%</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Clarity</span>
              <div className="text-lg font-bold text-white">{evaluation.clarityScore}%</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Relevance</span>
              <div className="text-lg font-bold text-white">{evaluation.relevanceScore}%</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Professionalism</span>
              <div className="text-lg font-bold text-white">{evaluation.professionalismScore}%</div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Strengths Highlighted</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {evaluation.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Improvement Suggestions</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {evaluation.improvementSuggestions.map((s, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setInterviewId(null);
                setEvaluation(null);
              }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-500/20"
            >
              Start New Mock Interview Session
            </button>
          </div>
        </div>
      ) : (
        /* Active Interview Transcript & Input Arena */
        <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-6">
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
            {transcript.map((t, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${t.sender === 'USER' ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                  t.sender === 'AI' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-600 text-white'
                }`}>
                  {t.sender === 'AI' ? 'AI' : 'YOU'}
                </div>
                <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-xl ${
                  t.sender === 'AI' ? 'bg-slate-950 border border-slate-800 text-slate-200' : 'bg-blue-600 text-white font-medium'
                }`}>
                  {t.text}
                </div>
              </div>
            ))}
          </div>

          {/* Turn Feedback snippet if present */}
          {turnResponse?.feedbackOnLastAnswer && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Feedback on last response: {turnResponse.feedbackOnLastAnswer}</span>
            </div>
          )}

          {/* Answer Input Controls */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Speak using microphone or type your interview response..."
              className="w-full h-24 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                <span>{isRecording ? 'Listening... Click to Stop' : 'Use Voice Input'}</span>
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={loading || !userAnswer.trim()}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Evaluating Response...' : 'Submit Answer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

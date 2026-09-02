import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { questionService, codeService } from '../services/api';
import { Question, CodeExecutionResult } from '../types';
import { Play, Send, CheckCircle2, XCircle, AlertTriangle, Clock, Terminal, ArrowLeft } from 'lucide-react';

export const CodingProblemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [code, setCode] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'CONSOLE' | 'CUSTOM_INPUT'>('CONSOLE');
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) return;
      try {
        const q = await questionService.getQuestionById(id);
        setQuestion(q);
        setCode(q.starterCode || 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello Verixa");\n    }\n}');
      } catch (err) {
        console.error('Failed to load problem', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTab('CONSOLE');
    try {
      const res = await codeService.executeCode('java', code, id, customInput || undefined);
      setExecutionResult(res);
    } catch (err: any) {
      setExecutionResult({
        status: 'RUNTIME_ERROR',
        stderr: err.response?.data?.message || 'Failed to execute code runner.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!id) return;
    setIsSubmitting(true);
    setActiveTab('CONSOLE');
    try {
      const res = await codeService.submitCode(id, 'java', code);
      setExecutionResult(res);
    } catch (err: any) {
      setExecutionResult({
        status: 'RUNTIME_ERROR',
        stderr: err.response?.data?.message || 'Failed to submit solution.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !question) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading problem arena...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <Link to="/dsa" className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-white">{question.title}</h1>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
            question.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
          }`}>
            {question.difficulty}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current text-blue-400" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Solution'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[650px]">
        {/* Left Column: Problem Description */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-6 overflow-y-auto max-h-[750px]">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white">Problem Description</h2>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {question.description}
            </div>
          </div>

          {question.constraints && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Constraints</h3>
              <pre className="p-3 rounded-xl bg-slate-950 text-xs font-mono text-slate-300 border border-slate-800">
                {question.constraints}
              </pre>
            </div>
          )}

          {question.inputFormat && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Input Format</h3>
              <p className="text-xs text-slate-300">{question.inputFormat}</p>
            </div>
          )}

          {question.sampleTestCases && question.sampleTestCases.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sample Test Cases</h3>
              {question.sampleTestCases.map((tc, idx) => (
                <div key={tc.id || idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">Input:</span>
                    <span className="text-blue-300">{tc.inputData}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">Expected Output:</span>
                    <span className="text-emerald-400">{tc.expectedOutput}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Monaco Code Editor & Console Output */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex-1 rounded-2xl bg-surface-900 border border-slate-800 overflow-hidden flex flex-col min-h-[450px]">
            {/* Editor Bar */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 font-mono text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Solution.java</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">Java 21</span>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-[380px]">
              <Editor
                height="100%"
                defaultLanguage="java"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v || '')}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
            </div>
          </div>

          {/* Execution Output Console */}
          <div className="p-4 rounded-2xl bg-surface-900 border border-slate-800 space-y-3 min-h-[180px]">
            <div className="flex items-center space-x-4 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('CONSOLE')}
                className={`text-xs font-bold transition-colors pb-1 border-b-2 ${
                  activeTab === 'CONSOLE' ? 'text-blue-400 border-blue-400' : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                Execution Console
              </button>
              <button
                onClick={() => setActiveTab('CUSTOM_INPUT')}
                className={`text-xs font-bold transition-colors pb-1 border-b-2 ${
                  activeTab === 'CUSTOM_INPUT' ? 'text-blue-400 border-blue-400' : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                Custom Input
              </button>
            </div>

            {activeTab === 'CUSTOM_INPUT' ? (
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter stdin custom input for testing (e.g. 4\n2 7 11 15\n9)..."
                className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            ) : (
              <div className="space-y-2">
                {executionResult ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      {executionResult.status === 'ACCEPTED' ? (
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ACCEPTED ({executionResult.testCasesPassed} / {executionResult.totalTestCases} Test Cases Passed)</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                          <XCircle className="w-4 h-4" />
                          <span>{executionResult.status}</span>
                        </div>
                      )}

                      {executionResult.runtimeMs !== undefined && (
                        <span className="text-[10px] text-slate-400 flex items-center space-x-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{executionResult.runtimeMs} ms</span>
                        </span>
                      )}
                    </div>

                    {executionResult.compileOutput && (
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono">
                        <span className="font-bold block mb-1 text-rose-400">Compilation Output:</span>
                        <pre className="whitespace-pre-wrap">{executionResult.compileOutput}</pre>
                      </div>
                    )}

                    {executionResult.stderr && (
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono">
                        <span className="font-bold block mb-1 text-rose-400">Standard Error / Stack Trace:</span>
                        <pre className="whitespace-pre-wrap">{executionResult.stderr}</pre>
                      </div>
                    )}

                    {executionResult.stdout && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200">
                        <span className="font-bold text-slate-400 block mb-1">Standard Output:</span>
                        <pre className="whitespace-pre-wrap">{executionResult.stdout}</pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 py-4 text-center">
                    Click "Run Code" or "Submit Solution" to view real compiler execution results.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

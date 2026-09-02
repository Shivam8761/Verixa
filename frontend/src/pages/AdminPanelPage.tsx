import React, { useState } from 'react';
import { adminService } from '../services/api';
import { ShieldCheck, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminPanelPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questionType, setQuestionType] = useState<'MCQ' | 'CODING' | 'TEXT'>('MCQ');
  const [category, setCategory] = useState<'PRACTICE' | 'PYQ_STYLE' | 'INTERVIEW'>('PRACTICE');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
  const [topicId, setTopicId] = useState('44444444-0001-0000-0000-000000000000'); // Default Arrays
  const [starterCode, setStarterCode] = useState('');
  const [solution, setSolution] = useState('');
  const [explanation, setExplanation] = useState('');

  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [correctOpt, setCorrectOpt] = useState(1);

  const [tcInput, setTcInput] = useState('');
  const [tcOutput, setTcOutput] = useState('');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const options = questionType === 'MCQ' ? [
      { optionText: opt1, isCorrect: correctOpt === 1 },
      { optionText: opt2, isCorrect: correctOpt === 2 },
    ] : undefined;

    const testCases = questionType === 'CODING' ? [
      { inputData: tcInput, expectedOutput: tcOutput, isHidden: false },
    ] : undefined;

    try {
      await adminService.createQuestion({
        title,
        description,
        questionType,
        category,
        difficulty,
        topicId,
        starterCode: questionType === 'CODING' ? starterCode : undefined,
        solution,
        explanation,
        options,
        testCases,
      });

      setSuccessMsg('Question created successfully in database!');
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to create question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Question Management</h1>
        <p className="text-sm text-slate-400">Create MCQ, Coding, and Text practice questions with test cases.</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleCreateQuestion} className="p-8 rounded-2xl bg-surface-900 border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Question Type</label>
            <select
              value={questionType}
              onChange={(e: any) => setQuestionType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="MCQ">MCQ</option>
              <option value="CODING">CODING</option>
              <option value="TEXT">TEXT</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Category</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="PRACTICE">PRACTICE</option>
              <option value="PYQ_STYLE">PYQ_STYLE</option>
              <option value="INTERVIEW">INTERVIEW</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e: any) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Question Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Reverse an Array in Java"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Problem Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Detailed problem description..."
            className="w-full h-24 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {questionType === 'MCQ' && (
          <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300">MCQ Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={opt1}
                onChange={(e) => setOpt1(e.target.value)}
                placeholder="Option 1"
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={opt2}
                onChange={(e) => setOpt2(e.target.value)}
                placeholder="Option 2"
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div className="text-xs text-slate-400">
              Correct Option:
              <select
                value={correctOpt}
                onChange={(e) => setCorrectOpt(Number(e.target.value))}
                className="ml-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value={1}>Option 1</option>
                <option value={2}>Option 2</option>
              </select>
            </div>
          </div>
        )}

        {questionType === 'CODING' && (
          <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300">Starter Code & Sample Test Case</h3>
            <textarea
              value={starterCode}
              onChange={(e) => setStarterCode(e.target.value)}
              placeholder="Java Starter Code..."
              className="w-full h-24 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={tcInput}
                onChange={(e) => setTcInput(e.target.value)}
                placeholder="Test Input (e.g. 3\n1 2 3)"
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white"
              />
              <input
                type="text"
                value={tcOutput}
                onChange={(e) => setTcOutput(e.target.value)}
                placeholder="Expected Output (e.g. 3 2 1)"
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>{loading ? 'Creating Question...' : 'Save Question to Database'}</span>
        </button>
      </form>
    </div>
  );
};

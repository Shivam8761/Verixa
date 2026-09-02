import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { questionService, topicService } from '../services/api';
import { Question, Topic, Difficulty } from '../types';
import { Code2, Terminal, ArrowRight, Filter, Search, CheckCircle2 } from 'lucide-react';

export const DsaPracticePage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDsaData = async () => {
      try {
        const [qList, tList] = await Promise.all([
          questionService.getGeneralDsaQuestions(selectedDifficulty || undefined),
          topicService.getTopics('DSA'),
        ]);
        setQuestions(qList);
        setTopics(tList);
      } catch (err) {
        console.error('Failed to load DSA questions', err);
      } finally {
        setLoading(false);
      }
    };
    loadDsaData();
  }, [selectedDifficulty]);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopicId ? q.topicId === selectedTopicId : true;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
          <Terminal className="w-4 h-4" />
          <span>General DSA Bank</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Data Structures & Algorithms</h1>
        <p className="text-sm text-slate-400">Master company-agnostic problem solving across core DSA topics.</p>
      </div>

      {/* Filter Controls */}
      <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by keyword (e.g. Two Sum, Palindrome)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | '')}
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setSelectedTopicId('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !selectedTopicId ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Topics
          </button>
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTopicId(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTopicId === t.id ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Table / Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading DSA problems...</div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>Showing {filteredQuestions.length} Problems</span>
            <span>Language: Java</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredQuestions.map((q) => (
              <div key={q.id} className="p-5 rounded-2xl bg-surface-900 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      q.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      q.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {q.topicName || 'DSA'}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base hover:text-blue-400 transition-colors">
                    <Link to={`/dsa/problem/${q.id}`}>{q.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{q.description}</p>
                </div>

                <Link
                  to={`/dsa/problem/${q.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap flex items-center space-x-1.5"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Solve Problem</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

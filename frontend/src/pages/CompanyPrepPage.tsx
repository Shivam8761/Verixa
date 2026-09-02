import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { companyService, questionService, roadmapService } from '../services/api';
import { Company, JobRole, SelectionRound, Question, Roadmap } from '../types';
import { Building2, Layers, CheckCircle2, ArrowRight, BookOpen, Compass, Sparkles } from 'lucide-react';

export const CompanyPrepPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [rounds, setRounds] = useState<SelectionRound[]>([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('11111111-1111-1111-1111-111111111111');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('22222222-2222-2222-2222-222222222222');
  const [prepMode, setPrepMode] = useState<'COMPLETE' | 'SPECIFIC_ROUND'>('COMPLETE');
  const [selectedRoundId, setSelectedRoundId] = useState<string>('');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const comps = await companyService.getCompanies();
        setCompanies(comps);
        const rls = await companyService.getRolesForCompany(selectedCompanyId);
        setRoles(rls);
        const rnds = await companyService.getRoundsForRole(selectedRoleId);
        setRounds(rnds);
        if (rnds.length > 0) setSelectedRoundId(rnds[0].id);

        const rmap = await roadmapService.createPlan(selectedCompanyId, selectedRoleId, 30, 'COMPLETE');
        setRoadmap(rmap);
      } catch (err) {
        console.error('Failed to load company prep data', err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleCompanyChange = async (companyId: string) => {
    setSelectedCompanyId(companyId);
    const rls = await companyService.getRolesForCompany(companyId);
    setRoles(rls);
    if (rls.length > 0) {
      setSelectedRoleId(rls[0].id);
      const rnds = await companyService.getRoundsForRole(rls[0].id);
      setRounds(rnds);
    }
  };

  const handleRoundSelect = async (roundId: string) => {
    setSelectedRoundId(roundId);
    setPrepMode('SPECIFIC_ROUND');
    setLoading(true);
    try {
      const qList = await questionService.getQuestions({
        companyId: selectedCompanyId,
        roleId: selectedRoleId,
        roundId,
      });
      setQuestions(qList);
    } catch (err) {
      console.error('Failed to load round questions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = async (mode: 'COMPLETE' | 'SPECIFIC_ROUND') => {
    setPrepMode(mode);
    if (mode === 'COMPLETE') {
      setLoading(true);
      try {
        const rmap = await roadmapService.createPlan(selectedCompanyId, selectedRoleId, 30, 'COMPLETE');
        setRoadmap(rmap);
      } finally {
        setLoading(false);
      }
    } else if (selectedRoundId) {
      handleRoundSelect(selectedRoundId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
          <Compass className="w-4 h-4" />
          <span>Preparation Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Target Company Preparation</h1>
        <p className="text-sm text-slate-400">Select target company, job profile, and preparation mode.</p>
      </div>

      {/* Target Company & Role Selector */}
      <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">1. Target Company</label>
            <select
              value={selectedCompanyId}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.description}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">2. Job Profile / Cadre</label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.title} Cadre</option>
              ))}
            </select>
          </div>
        </div>

        {/* Preparation Mode Tabs */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-slate-300">3. Select Preparation Mode</label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleModeChange('COMPLETE')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 transition-all ${
                prepMode === 'COMPLETE'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>MODE B — Complete Preparation Roadmap (30 Days)</span>
            </button>

            <button
              onClick={() => handleModeChange('SPECIFIC_ROUND')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 transition-all ${
                prepMode === 'SPECIFIC_ROUND'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>MODE A — Specific Round Preparation</span>
            </button>
          </div>
        </div>

        {/* Specific Round Buttons */}
        {prepMode === 'SPECIFIC_ROUND' && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-xs text-slate-400 font-semibold">Available Selection Rounds for TCS Ninja:</div>
            <div className="flex flex-wrap gap-2">
              {rounds.map((rnd) => (
                <button
                  key={rnd.id}
                  onClick={() => handleRoundSelect(rnd.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedRoundId === rnd.id
                      ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Round {rnd.roundOrder}: {rnd.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content View */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading questions...</div>
      ) : prepMode === 'COMPLETE' ? (
        /* Roadmap View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">TCS Ninja 30-Day Preparation Schedule</h2>
            <span className="text-xs text-slate-400 font-semibold">{roadmap?.items.length || 30} Daily Milestones</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap?.items.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-surface-900 border border-slate-800 space-y-2 flex items-start space-x-3">
                <div className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                  item.isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.dayNumber}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>{item.topicName}</span>
                    {item.isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-xs text-slate-400">{item.taskDescription}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Specific Round Question List */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Specific Round Practice Questions</h2>
            <span className="text-xs text-slate-400 font-semibold">{questions.length} Questions Available</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {questions.map((q) => (
              <div key={q.id} className="p-5 rounded-2xl bg-surface-900 border border-slate-800 space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {q.questionType}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {q.category}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                      q.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base">{q.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{q.description}</p>
                </div>

                <Link
                  to={q.questionType === 'CODING' ? `/dsa/problem/${q.id}` : `/practice/${q.id}`}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap flex items-center justify-center space-x-1.5"
                >
                  <span>Solve Question</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

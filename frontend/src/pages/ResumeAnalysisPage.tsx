import React, { useState } from 'react';
import { resumeService } from '../services/api';
import { ResumeAnalysis } from '../types';
import { FileText, Upload, CheckCircle2, AlertCircle, Sparkles, Building2 } from 'lucide-react';

export const ResumeAnalysisPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a valid PDF file.');
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const res = await resumeService.analyzeResume(file, '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
      setAnalysis(res);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to extract text from PDF resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
          <FileText className="w-4 h-4" />
          <span>Apache PDFBox Parser & AI Match</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">PDF Resume AI Skill Match</h1>
        <p className="text-sm text-slate-400">Upload your PDF resume for instant text extraction and TCS Ninja target role matching.</p>
      </div>

      {/* File Upload Card */}
      <div className="p-8 rounded-2xl bg-surface-900 border border-slate-800 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
          <Upload className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">Upload Resume (PDF format)</h3>
          <p className="text-xs text-slate-400">PDF text is parsed server-side using Apache PDFBox.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs max-w-md mx-auto">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center justify-center space-y-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-resume-input"
          />
          <label
            htmlFor="pdf-resume-input"
            className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold cursor-pointer transition-colors"
          >
            {file ? file.name : 'Select PDF File from Computer'}
          </label>

          {file && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              {loading ? 'Extracting & Analyzing...' : 'Run Apache PDFBox AI Match'}
            </button>
          )}
        </div>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div className="p-8 rounded-2xl bg-surface-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">TCS Ninja Role Match Result</span>
              <h2 className="text-xl font-bold text-white">{analysis.fileName}</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-400">{analysis.overallMatchScore}%</span>
              <span className="text-xs text-slate-400 block">Match Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Found Strong Skills */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Identified Strong Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.strongSkills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">Missing Target Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
                    ✗ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Resume Action Plan</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {analysis.recommendations.map((r, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

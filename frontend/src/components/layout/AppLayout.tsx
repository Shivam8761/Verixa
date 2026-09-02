import React from 'react';
import { Navbar } from './Navbar';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950 text-slate-100">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer className="border-t border-slate-800/60 bg-surface-900/40 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-400">VERIXA</span> — "Prepare smarter. Practice realistically. Get interview ready."
          </div>
          <div>
            Data-driven placement preparation engine &copy; {new Date().getFullYear()} Verixa Inc.
          </div>
        </div>
      </footer>
    </div>
  );
};

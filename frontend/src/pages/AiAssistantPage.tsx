import React, { useState } from 'react';
import { aiService } from '../services/api';
import { Bot, Send, Sparkles, Lightbulb, Compass, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
}

export const AiAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'AI',
      text: 'Hello! I am VERIXA AI, your software architecture and placement mentor. Ask me to explain a concept, give a hint for a problem, or build a study strategy for TCS Ninja.',
    },
  ]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || prompt;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'USER', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setPrompt('');
    setLoading(true);

    try {
      const res = await aiService.chat(textToSend);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'AI', text: res.responseText };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat failed', err);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'AI', text: 'Sorry, I ran into an error processing your request.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
          <Bot className="w-4 h-4" />
          <span>Real AI Placement Assistant</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">AI Assistant Chat</h1>
        <p className="text-sm text-slate-400">Get context-aware explanations, code hints, and company strategy.</p>
      </div>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleSend('Explain string constant pool in Java')}
          className="px-3 py-1.5 rounded-xl bg-surface-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Explain String Constant Pool</span>
        </button>

        <button
          onClick={() => handleSend('Give me a 7 day strategy for TCS Ninja Aptitude round')}
          className="px-3 py-1.5 rounded-xl bg-surface-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5"
        >
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>TCS Ninja 7-Day Strategy</span>
        </button>

        <button
          onClick={() => handleSend('How do I optimize two sum array problem from O(N^2) to O(N)?')}
          className="px-3 py-1.5 rounded-xl bg-surface-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Optimize Two Sum Complexity</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="p-6 rounded-2xl bg-surface-900 border border-slate-800 space-y-4 min-h-[450px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${m.sender === 'USER' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                m.sender === 'AI' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-600 text-white'
              }`}>
                {m.sender === 'AI' ? 'AI' : 'YOU'}
              </div>
              <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-2xl ${
                m.sender === 'AI' ? 'bg-slate-950 border border-slate-800 text-slate-200' : 'bg-blue-600 text-white font-medium'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 animate-pulse">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>VERIXA AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="flex items-center space-x-2 pt-4 border-t border-slate-800">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask VERIXA AI a preparation question..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !prompt.trim()}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

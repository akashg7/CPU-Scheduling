'use client';

import { useState, useRef, useEffect } from 'react';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { LandingNav } from '@/components/landing/LandingNav';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "Why is FCFS bad for short processes?",
  "Explain the convoy effect",
  "When should I use Round Robin?",
  "What's the difference between SJF and SRTF?",
  "How does Priority Scheduling cause starvation?",
  "What is CPU utilization?",
  "Compare all algorithms for my workload",
  "Explain turnaround time vs waiting time",
];

export default function SchedBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'bot',
      content: "Hey! I'm **SchedBot** 🤖 — your CPU scheduling expert.\n\nI can explain any algorithm, analyze your simulation results, or help you understand OS concepts. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const payloadJson = sessionStorage.getItem('schedbot_insights_payload');
    if (!payloadJson) return;
    try {
      JSON.parse(payloadJson);
    } catch {
      return;
    }
    const timer = setTimeout(async () => {
      sessionStorage.removeItem('schedbot_insights_payload');
      try {
        const res = await fetch('/api/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payloadJson,
        });
        const data = await res.json();
        const insights: string = data?.insights ?? '';
        sendMessage('Analyze my current simulation results', insights || undefined);
      } catch {
        sendMessage('Analyze my current simulation results');
      }
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount when payload is present
  }, []);

  const sendMessage = async (text?: string, insights?: string) => {
    const content = text || input.trim();
    if (!content || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'schedbot',
          insights: insights ?? undefined,
          messages: [...messages, userMsg]
            .slice(-10)
            .map((m) => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content })),
        }),
      });

      const data = await response.json();
      const botContent = data.content ?? "Sorry, I had trouble thinking that through. Try again!";

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: botContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "⚠️ Couldn't connect to AI. Check your network and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0A0A0F] flex flex-col overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <LandingNav />
      {/* Hero with Spline Robot */}
      <div className="relative w-full bg-black/[0.96] overflow-hidden pt-16" style={{ height: '420px' }}>
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(124,58,237,0.6)" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 flex h-full">
          <div className="flex-1 flex flex-col justify-center px-12 lg:px-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-6 w-fit">
              <span className="text-xs font-bold text-violet-400 tracking-widest uppercase font-mono">
                AI ASSISTANT
              </span>
            </div>
            <h1
              className="font-bold text-white mb-4 font-display"
              style={{
                fontSize: 'clamp(40px, 5vw, 64px)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              Meet{' '}
              <span
                className="bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent"
              >
                SchedBot
              </span>
            </h1>
            <p className="text-slate-400 mb-8 max-w-md leading-relaxed text-base">
              Your expert AI on CPU scheduling. Ask anything — from algorithm tradeoffs to analyzing your own simulation results.
            </p>
            <div className="flex gap-3 flex-wrap">
              {['FCFS', 'Round Robin', 'SJF', 'SRTF', 'Priority', 'MLQ'].map((algo) => (
                <span
                  key={algo}
                  className="px-3 py-1 rounded-md text-xs font-mono text-slate-500 border border-slate-800 bg-slate-900"
                >
                  {algo}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 relative min-h-[320px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-[300px] h-[300px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
                }}
              />
            </div>
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full min-h-[320px]"
            />
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 pb-6 pt-8">
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <p className="text-xs text-slate-600 mb-3 uppercase tracking-widest font-mono">
              Try asking
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 border border-slate-800 bg-slate-900/50 hover:border-violet-500/50 hover:text-violet-300 hover:bg-violet-500/5 transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div
          className="flex-1 flex flex-col gap-4 mb-6 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 600px)', minHeight: 200 }}
        >
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'bot' && (
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-violet-500/20 border border-violet-500/40"
                  >
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-xl rounded-2xl px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-600 to-violet-800 text-white rounded-br-md rounded-tl-xl rounded-tr-xl rounded-bl-xl'
                      : 'bg-schedos-surface border border-slate-800 text-slate-200 rounded-bl-md rounded-tl-xl rounded-br-xl rounded-tr-xl'
                  }`}
                >
                  {msg.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                    i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part
                  )}
                  <div className="mt-2 text-xs opacity-40 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-violet-600/20 border border-violet-500/30">
                    👤
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-violet-500/20 border border-violet-500/40">
                🤖
              </div>
              <div className="flex items-center gap-1.5 px-5 py-4 rounded-2xl bg-schedos-surface border border-slate-800 rounded-bl-md rounded-tl-xl rounded-br-xl rounded-tr-xl">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="relative">
          <div
            className="flex gap-3 items-end p-2 rounded-2xl bg-schedos-surface border border-slate-800"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any scheduling algorithm..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-white text-sm px-3 py-2.5 outline-none placeholder:text-slate-600"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800"
            >
              Send →
            </button>
          </div>
          <p className="text-xs text-slate-700 mt-2 text-center font-mono">
            Powered by Claude · Anthropic
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes animate-spotlight {
          0% { opacity: 0; transform: translate(-72%, -62%) skewX(-30deg); }
          100% { opacity: 1; transform: translate(-50%, -40%) skewX(-30deg); }
        }
        .animate-spotlight {
          animation: animate-spotlight 2s ease forwards;
        }
      `}} />
    </div>
  );
}

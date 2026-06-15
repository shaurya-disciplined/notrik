"use client";
import React, { useEffect, useState } from "react";
import { Activity, Terminal, Server, Cpu, Database, CheckCircle2, AlertCircle } from "lucide-react";

export default function TraceLogsPage() {
  const [logs, setLogs] = useState<{id: number, time: string, message: string, type: 'info' | 'success' | 'warn', latency: string}[]>([]);

  useEffect(() => {
    // Simulate live logs coming in
    const dummyLogs = [
      { message: "Initializing Gemini Pro Vision model...", type: "info" as const, latency: "12ms" },
      { message: "Connecting to secure artifact storage...", type: "info" as const, latency: "45ms" },
      { message: "Authentication verified for user session.", type: "success" as const, latency: "105ms" },
      { message: "Awaiting incoming transformation requests.", type: "warn" as const, latency: "-" },
    ];
    
    let counter = 0;
    const interval = setInterval(() => {
      if (counter < dummyLogs.length) {
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
        
        setLogs(prev => [...prev, {
          id: Date.now(),
          time: timeString,
          ...dummyLogs[counter]
        }]);
        counter++;
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-12 px-4 relative overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-3/10 text-brand-3 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-serif font-black text-4xl text-gradient mb-1 tracking-tight">System Trace Logs</h1>
              <p className="font-sans text-[13px] text-foreground/50 font-medium">Live observability of AI models and backend pipeline.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl font-sans font-bold text-[10px] uppercase tracking-widest shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> Systems Operational
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel border border-black/5 rounded-[1.5rem] p-5.5 hover:shadow-lg transition-all duration-300 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-brand-3/10 text-brand-3 flex items-center justify-center shrink-0">
              <Cpu className="w-5.5 h-5.5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-1.5">Model Engine</h3>
              <p className="font-sans font-black text-sm text-foreground">Gemini 3.1 Pro</p>
              <div className="mt-3 text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
              </div>
            </div>
          </div>
          
          <div className="glass-panel border border-black/5 rounded-[1.5rem] p-5.5 hover:shadow-lg transition-all duration-300 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Server className="w-5.5 h-5.5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-1.5">OCR Pipeline</h3>
              <p className="font-sans font-black text-sm text-foreground">Notrik Vision v2</p>
              <div className="mt-3 text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Idle
              </div>
            </div>
          </div>
          
          <div className="glass-panel border border-black/5 rounded-[1.5rem] p-5.5 hover:shadow-lg transition-all duration-300 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Database className="w-5.5 h-5.5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-foreground/45 mb-1.5">Vector DB</h3>
              <p className="font-sans font-black text-sm text-foreground">Pinecone Serverless</p>
              <div className="mt-3 text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Connected
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Window */}
        <div className="w-full bg-[#0a0a0a] rounded-[2rem] shadow-xl overflow-hidden border border-white/10">
          <div className="bg-[#121212] px-6 py-4 flex items-center gap-4 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="font-mono text-[10px] text-white/45 flex items-center gap-2 tracking-widest uppercase ml-4">
              <Terminal className="w-3.5 h-3.5 text-brand-4" strokeWidth={2} /> root@notrik-server-01
            </div>
          </div>
          
          <div className="p-6 font-mono text-[12px] h-[400px] overflow-y-auto flex flex-col gap-3 scrollbar-thin">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
                <span className="text-white/30 shrink-0 w-[100px]">{log.time}</span>
                <span className={`shrink-0 flex items-center justify-center ${
                  log.type === 'success' ? 'text-green-500' :
                  log.type === 'warn' ? 'text-yellow-500' : 'text-blue-400'
                }`}>
                  {log.type === 'success' && <CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
                  {log.type === 'warn' && <AlertCircle className="w-4 h-4" strokeWidth={2} />}
                  {log.type === 'info' && <span className="text-blue-400 font-bold">ℹ</span>}
                </span>
                <span className="text-white/80 flex-1 leading-relaxed">{log.message}</span>
                <span className="text-white/30 shrink-0 font-semibold">{log.latency}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-white/50 animate-pulse mt-4">
              <span className="w-2 h-4 bg-white/50 inline-block"></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

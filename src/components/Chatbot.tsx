"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { usePathname } from "next/navigation";

export default function Chatbot() {
  const pathname = usePathname();
  const hideOnPaths = ['/login', '/signup', '/onboarding'];
  
  const [isOpen, setIsOpen] = useState(false);
  const initialMessage = { role: 'model' as const, parts: [{ text: "Hi there! I'm the Notrik AI assistant. How can I help you today?" }] };
  const [messages, setMessages] = useState<{role: 'user' | 'model', parts: {text: string}[]}[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const clearChat = () => {
    setMessages([initialMessage]);
  };

  // Listen for custom events from dashboard
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOpen(true);
      if (customEvent.detail?.message) {
        // Send the message immediately
        handleSendMessage(customEvent.detail.message);
      }
    };

    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, [messages]); // Include messages in dependency array so we get latest state

  const handleSendMessage = async (userMsg: string) => {
    if (!userMsg.trim() || isLoading) return;
    
    const newHistory = [...messages, { role: 'user' as const, parts: [{ text: userMsg }] }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const apiHistory = messages.slice(1).map(msg => ({
        role: msg.role,
        parts: msg.parts
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: apiHistory
        }),
      });

      if (!response.ok) {
        let errStr = 'API failed';
        try {
          const errData = await response.json();
          errStr = errData.error || errStr;
        } catch(e) {}
        throw new Error(errStr);
      }

      const data = await response.json();
      
      if (data.text) {
        setMessages([...newHistory, { role: 'model', parts: [{ text: data.text }] }]);
      } else {
        throw new Error('No text in response');
      }
    } catch (err: any) {
      setMessages([...newHistory, { role: 'model', parts: [{ text: `Oops, I ran into an error: ${err.message}. Please try again later.` }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMsg = input;
    setInput("");
    await handleSendMessage(userMsg);
  };

  if (hideOnPaths.includes(pathname)) return null;

  return (
    <div className="print:hidden">
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-full bg-brand-4 text-white shadow-2xl shadow-brand-4/30 hover:scale-105 hover:shadow-brand-4/50 hover:bg-brand-4/90 transition-all duration-300 flex items-center gap-3 font-serif font-bold tracking-wide group ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
        Ask AI Mentor
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[400px] sm:w-[450px] h-[600px] max-h-[85vh] flex flex-col glass-panel border border-white/40 shadow-[0_0_50px_-12px_rgba(52,134,227,0.4)] bg-white/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 pointer-events-none translate-y-10'}`}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 w-full h-32 bg-brand-4/20 blur-[50px] pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10 border-b border-black/5 p-5 flex items-center justify-between bg-gradient-to-b from-white/80 to-transparent">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-4 rounded-full animate-ping opacity-20"></div>
              <div className="w-12 h-12 rounded-full bg-brand-4 flex items-center justify-center text-white shadow-xl shadow-brand-4/30 relative z-10 border-2 border-white/50">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl leading-tight text-foreground">AI Mentor</h3>
              <p className="font-sans text-xs text-foreground/50 flex items-center gap-1.5 mt-0.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span> Context Synced
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={clearChat}
              title="Clear chat"
              className="p-2.5 rounded-full hover:bg-black/5 text-foreground/40 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2.5 rounded-full hover:bg-black/5 text-foreground/40 hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-black/10 relative z-10">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] rounded-3xl px-5 py-4 font-sans text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-brand-4 to-blue-600 text-white rounded-br-sm shadow-brand-4/20' 
                    : 'bg-white/80 border border-black/5 text-foreground rounded-tl-sm backdrop-blur-md'
                }`}
              >
                {msg.role === 'user' ? (
                  msg.parts[0].text
                ) : (
                  <div className="prose prose-sm prose-p:my-1 prose-headings:my-2 prose-strong:text-brand-4 prose-ul:my-1 text-foreground/90 max-w-none prose-a:text-brand-1">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          return (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.parts[0].text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/80 border border-black/5 rounded-3xl rounded-tl-sm px-5 py-4 shadow-sm backdrop-blur-md flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-brand-4 animate-spin" />
                <span className="font-sans text-sm text-brand-4 font-medium animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 bg-white/40 backdrop-blur-md border-t border-black/5">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              className="w-full bg-white border border-black/10 rounded-full pl-5 pr-12 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-4/50 focus:border-transparent transition-all shadow-inner"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 rounded-full bg-brand-4 text-white disabled:bg-black/10 disabled:text-black/30 transition-colors hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";
import React, { useState, createContext, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Plus, FolderPlus, Search, Library, Activity, Calendar, 
  MessageSquare, Headphones, DollarSign, LogOut, Sparkles, X, Menu
} from "lucide-react";

export const DashboardContext = createContext<any>(null);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [folders, setFolders] = useState<any[]>([]);
  const [subfolders, setSubfolders] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [isFolderPopupOpen, setIsFolderPopupOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { currentUser, isLoading, logout } = useAuth();

  // Close sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  // Auth Guard
  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        router.push("/login");
      } else if (!currentUser.onboarding_completed) {
        router.push("/onboarding");
      }
    }
  }, [isLoading, currentUser, router]);

  // Fetch real data on mount
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await fetch('/api/library');
        if (res.ok) {
          const data = await res.json();
          setFolders(data.folders || []);
          setSubfolders(data.subfolders || []);
          setNotes(data.notes || []);
        }
      } catch (err) {
        console.error("Failed to fetch library", err);
      }
    };
    fetchLibrary();
  }, []);
  
  // Planner State
  const [tasks, setTasks] = useState<{id: string, text: string, completed: boolean, subject: string}[]>([]);
  const [classes, setClasses] = useState<{id: string, name: string}[]>([]);
  const [assignments, setAssignments] = useState<{id: string, title: string, due: string}[]>([]);
  const [exams, setExams] = useState<{id: string, title: string, date: string}[]>([]);

  // Load Planner Data
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("notrik_tasks");
      const savedClasses = localStorage.getItem("notrik_classes");
      const savedAssignments = localStorage.getItem("notrik_assignments");
      const savedExams = localStorage.getItem("notrik_exams");

      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedClasses) setClasses(JSON.parse(savedClasses));
      if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
      if (savedExams) setExams(JSON.parse(savedExams));
    } catch (err) {
      console.error("Failed to load planner data", err);
    }
  }, []);

  // Save Planner Data
  useEffect(() => {
    localStorage.setItem("notrik_tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("notrik_classes", JSON.stringify(classes));
  }, [classes]);
  useEffect(() => {
    localStorage.setItem("notrik_assignments", JSON.stringify(assignments));
  }, [assignments]);
  useEffect(() => {
    localStorage.setItem("notrik_exams", JSON.stringify(exams));
  }, [exams]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      try {
        const res = await fetch('/api/folders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newFolderName })
        });
        if (res.ok) {
          const data = await res.json();
          setFolders([data.folder, ...folders]);
          setNewFolderName("");
          setIsFolderPopupOpen(false);
          router.push('/dashboard/library');
        }
      } catch (err) {
        console.error("Error creating folder", err);
      }
    }
  };

  if (isLoading || !currentUser) {
    return <div className="min-h-screen flex items-center justify-center font-sans font-bold text-brand-1">Loading...</div>;
  }
  
  return (
    <DashboardContext.Provider value={{ 
      folders, setFolders, 
      subfolders, setSubfolders,
      notes, setNotes,
      isFolderPopupOpen, setIsFolderPopupOpen,
      tasks, setTasks,
      classes, setClasses,
      assignments, setAssignments,
      exams, setExams
    }}>
      <div className="min-h-screen p-4 md:p-8 flex flex-col md:flex-row gap-6 w-full text-foreground relative">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between glass-panel rounded-2xl py-2 px-4 w-full z-30 sticky top-4 print:hidden">
          <Link href="/" className="flex items-center gap-3">
            <img src="/fevi-con.png" alt="Notrik Icon" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="font-sans font-bold text-xl tracking-tight">Notrik</span>
          </Link>
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Sidebar Backdrop */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>
        )}

        {/* NEW FOLDER POPUP MODAL */}
        {isFolderPopupOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/45 backdrop-blur-md" onClick={() => setIsFolderPopupOpen(false)}></div>
            <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 w-full max-w-md shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-black/5 relative z-10 animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => setIsFolderPopupOpen(false)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
                <X className="w-5 h-5 text-foreground/50" />
              </button>
              <h2 className="font-serif font-bold text-2xl mb-1.5 flex items-center gap-2">
                <span className="text-gradient">Create New Folder</span> <span>📁</span>
              </h2>
              <p className="font-sans text-foreground/60 text-[13px] mb-6 font-medium">Organize your study materials by subject or chapter.</p>
              
              <form onSubmit={handleCreateFolder}>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="E.g., Organic Chemistry II" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-black/5 border border-black/10 rounded-2xl px-5 py-4 font-sans outline-none focus:bg-white focus:ring-2 focus:ring-brand-3/30 focus:border-brand-3 transition-all mb-6 text-sm"
                />
                <button type="submit" disabled={!newFolderName.trim()} className="w-full bg-gradient-to-r from-brand-3 to-brand-4 text-white font-sans font-bold py-4 rounded-2xl hover:opacity-95 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.25)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0">
                  Create Folder 🚀
                </button>
              </form>
            </div>
          </div>
        )}

        {/* LEFT SIDEBAR */}
        <aside className={`
          print:hidden
          glass-panel
          w-[280px] md:w-68 rounded-r-[2.5rem] md:rounded-[3rem] p-6.5 flex flex-col shrink-0 
          h-[100dvh] md:h-[calc(100vh-4rem)] 
          fixed md:sticky top-0 md:top-8 left-0 z-50 md:z-40 
          overflow-y-auto overflow-x-hidden scrollbar-hide
          border-r border-black/5 shadow-[5px_0_30px_rgba(0,0,0,0.02)]
          transform transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between md:hidden mb-2">
              <Link href="/" className="flex items-center gap-3">
                <img src="/fevi-con.png" alt="Notrik Icon" className="w-8 h-8 object-contain drop-shadow-md" />
                <span className="font-sans font-bold text-xl tracking-tight text-gradient">Notrik</span>
              </Link>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
              >
                <X className="w-4 h-4 text-foreground/70" />
              </button>
            </div>

            <Link href="/" className="hidden md:flex items-center gap-3 px-2">
              <img src="/fevi-con.png" alt="Notrik Icon" className="w-8 h-8 object-contain drop-shadow-md hover:rotate-6 transition-transform" />
              <span className="font-sans font-black text-2xl tracking-tight text-gradient">Notrik</span>
            </Link>

            <nav className="flex flex-col gap-1.5 font-sans font-medium text-[13px]">
              {/* Primary Actions */}
              <Link href="/dashboard" className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl transition-all bg-gradient-to-r from-brand-3 via-brand-4 to-brand-3 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 group mb-4 relative overflow-hidden active:translate-y-0">
                <div className="absolute inset-0 shimmer-effect opacity-35 pointer-events-none"></div>
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300 relative z-10" /> 
                <span className="font-bold relative z-10 tracking-wide">Transform Notes ✨</span>
              </Link>
              
              <button onClick={() => setIsFolderPopupOpen(true)} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-black/5 text-foreground/60 w-full text-left group hover:translate-x-1 duration-200">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                  <FolderPlus className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold group-hover:text-amber-800 transition-colors">New Folder 📁</span>
              </button>
              
              <Link href="/dashboard/search" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group hover:translate-x-1 duration-200 ${pathname === '/dashboard/search' ? 'bg-gradient-to-r from-brand-3/10 to-brand-4/5 text-brand-3 font-bold border-l-2 border-brand-3' : 'hover:bg-black/5 text-foreground/60'}`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform ${pathname === '/dashboard/search' ? 'bg-brand-3/15 text-brand-3' : 'bg-slate-500/10 text-slate-500 group-hover:scale-110'}`}>
                  <Search className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold">Search Anything 🔍</span>
              </Link>
              
              <div className="my-2 border-t border-black/5"></div>
              
              {/* Secondary Actions */}
              <div className="flex flex-col gap-1">
                <Link href="/dashboard/library/structured-notes" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group hover:translate-x-1 duration-200 ${pathname.startsWith('/dashboard/library') ? 'bg-gradient-to-r from-brand-3/10 to-brand-4/5 text-brand-3 font-bold border-l-2 border-brand-3' : 'hover:bg-black/5 text-foreground/60'}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform ${pathname.startsWith('/dashboard/library') ? 'bg-brand-3/15 text-brand-3' : 'bg-blue-500/10 text-blue-500 group-hover:scale-110'}`}>
                    <Library className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold">Study Library 🗂️</span>
                </Link>
                {pathname.startsWith('/dashboard/library') && (
                  <div className="ml-8 mt-0.5 flex flex-col gap-1 pl-4.5 border-l border-black/10">
                    <Link href="/dashboard/library/structured-notes" className={`py-2 text-[12px] transition-colors flex items-center gap-1.5 ${pathname === '/dashboard/library/structured-notes' || pathname === '/dashboard/library' ? 'text-brand-3 font-bold' : 'text-foreground/50 hover:text-foreground'}`}>
                      <span>📝</span> Structured Notes
                    </Link>
                    <Link href="/dashboard/library/smart-flashcards" className={`py-2 text-[12px] transition-colors flex items-center gap-1.5 ${pathname === '/dashboard/library/smart-flashcards' ? 'text-brand-3 font-bold' : 'text-foreground/50 hover:text-foreground'}`}>
                      <span>🗂️</span> Smart Flashcards
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/dashboard/trace" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group hover:translate-x-1 duration-200 ${pathname === '/dashboard/trace' ? 'bg-gradient-to-r from-brand-3/10 to-brand-4/5 text-brand-3 font-bold border-l-2 border-brand-3' : 'hover:bg-black/5 text-foreground/60'}`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform ${pathname === '/dashboard/trace' ? 'bg-brand-3/15 text-brand-3' : 'bg-emerald-500/10 text-emerald-500 group-hover:scale-110'}`}>
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold">Trace & Logs 📈</span>
              </Link>
              <Link href="/dashboard/planner" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group hover:translate-x-1 duration-200 ${pathname === '/dashboard/planner' ? 'bg-gradient-to-r from-brand-3/10 to-brand-4/5 text-brand-3 font-bold border-l-2 border-brand-3' : 'hover:bg-black/5 text-foreground/60'}`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform ${pathname === '/dashboard/planner' ? 'bg-brand-3/15 text-brand-3' : 'bg-purple-500/10 text-purple-500 group-hover:scale-110'}`}>
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold">Study Planner 📅</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex flex-col gap-4.5 mt-auto pt-6">
            <div className="px-4 text-[9px] font-bold text-foreground/35 uppercase tracking-widest mb-0.5">Other Resources</div>
            <nav className="flex flex-col gap-1 font-sans font-medium text-[13px]">
              <Link href="/dashboard/feedback" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group hover:translate-x-1 duration-200 ${pathname === '/dashboard/feedback' ? 'bg-gradient-to-r from-brand-3/10 to-brand-4/5 text-brand-3 font-bold border-l-2 border-brand-3' : 'hover:bg-black/5 text-foreground/60'}`}>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-transform ${pathname === '/dashboard/feedback' ? 'bg-brand-3/15 text-brand-3' : 'bg-indigo-500/10 text-indigo-500 group-hover:scale-110'}`}>
                  <MessageSquare className="w-3 h-3" />
                </div>
                <span className="font-bold">Feedback 💬</span>
              </Link>
              <Link href="/dashboard/support" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group hover:translate-x-1 duration-200 ${pathname === '/dashboard/support' ? 'bg-gradient-to-r from-brand-3/10 to-brand-4/5 text-brand-3 font-bold border-l-2 border-brand-3' : 'hover:bg-black/5 text-foreground/60'}`}>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-transform ${pathname === '/dashboard/support' ? 'bg-brand-3/15 text-brand-3' : 'bg-rose-500/10 text-rose-500 group-hover:scale-110'}`}>
                  <Headphones className="w-3 h-3" />
                </div>
                <span className="font-bold">Support Desk 🎧</span>
              </Link>
              <Link href="/dashboard/invite" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group hover:translate-x-1 duration-200 ${pathname === '/dashboard/invite' ? 'bg-gradient-to-r from-brand-3/10 to-brand-4/5 text-brand-3 font-bold border-l-2 border-brand-3' : 'hover:bg-black/5 text-foreground/60'}`}>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-transform ${pathname === '/dashboard/invite' ? 'bg-brand-3/15 text-brand-3' : 'bg-violet-500/10 text-violet-600 group-hover:scale-110'}`}>
                  <DollarSign className="w-3 h-3" />
                </div>
                <span className="font-bold">Invite & Earn 💰</span>
              </Link>
            </nav>

            {/* Quota Widget */}
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-2/95 to-brand-1 text-white rounded-[1.5rem] p-4.5 shadow-[0_12px_28px_-8px_rgba(30,58,138,0.3)] border border-brand-3/25 flex flex-col gap-3">
              <div className="absolute -right-6 -top-6 w-20 h-20 bg-brand-3/20 rounded-full blur-2xl"></div>
              <div className="flex justify-between items-center text-[10px] font-sans font-extrabold uppercase tracking-widest text-brand-4">
                <span>Free Plan 🎯</span>
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-white">{5 - (currentUser?.credits ?? 5)}/5 Used</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-brand-4 to-brand-3 h-full rounded-full transition-all duration-500" style={{ width: `${((5 - (currentUser?.credits ?? 5)) / 5) * 100}%` }}></div>
              </div>
              <div className="text-[11px] text-white/70 font-sans font-semibold">{(currentUser?.credits ?? 5)} free transforms remaining</div>
              
              <button className="w-full bg-white text-brand-1 hover:bg-brand-4 hover:text-white rounded-xl py-2.5 font-sans font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 mt-1 relative overflow-hidden group">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:scale-125 transition-transform" /> 
                <span className="font-bold">Upgrade to Pro 🚀</span>
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center justify-between px-2 pt-3 mt-1 border-t border-black/5 group">
              <Link href="/dashboard/settings" className="flex items-center gap-3 hover:opacity-85 transition-opacity cursor-pointer">
                <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-brand-3 to-brand-2 text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase shadow-md">
                  {currentUser.initials}
                </div>
                <div className="overflow-hidden">
                  <div className="font-sans font-bold text-[13px] leading-tight text-foreground truncate max-w-[110px]">{currentUser.name}</div>
                  <div className="font-sans text-[10px] text-foreground/50 truncate max-w-[110px] font-medium">{currentUser.email}</div>
                </div>
              </Link>
              <button onClick={logout} className="w-8.5 h-8.5 flex items-center justify-center hover:bg-red-500/10 rounded-xl transition-all hover:text-red-500 text-foreground/40 shrink-0">
                <LogOut className="w-4 h-4 transition-colors shrink-0" />
              </button>
            </div>
          </div>
        </aside>

        {/* DYNAMIC CONTENT */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </DashboardContext.Provider>
  );
}

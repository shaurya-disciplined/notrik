"use client";
import React, { useContext, useState } from "react";
import { 
  Upload, FileText, Camera, ArrowRight, Settings2, BrainCircuit, Folder, Sparkles, Lightbulb, Clock, Flame, Zap, BarChart2, X, CheckCircle2
} from "lucide-react";
import { DashboardContext } from "./layout";
import { compressImage } from "@/lib/imageUtils";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { folders, setFolders, notes, setNotes } = useContext(DashboardContext);
  const { currentUser, decrementCredits } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSuccess, setProcessingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Floating Toast State
  const [toast, setToast] = useState<{ show: boolean; noteId: string; noteTitle: string; formatRequested?: string } | null>(null);

  const [activeTab, setActiveTab] = useState<"upload" | "camera" | "paste">("upload");

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [format, setFormat] = useState("Markdown Notes");
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const calculateStreak = (notesList: any[]) => {
    if (!notesList || notesList.length === 0) return 0;
    
    // Get unique dates (YYYY-MM-DD format) in descending order
    const dates = Array.from(
      new Set(
        notesList.map(note => {
          try {
            return new Date(note.createdAt).toISOString().split('T')[0];
          } catch (e) {
            return null;
          }
        }).filter(Boolean)
      )
    ).sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime()) as string[];

    if (dates.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If the most recent note is not from today or yesterday, the streak is broken (0)
    const mostRecentDate = dates[0];
    if (mostRecentDate !== today && mostRecentDate !== yesterday) {
      return 0;
    }

    let currentStreakValue = 0;
    let currentDate = new Date(mostRecentDate);

    for (let i = 0; i < dates.length; i++) {
      const expectedDateStr = currentDate.toISOString().split('T')[0];
      if (dates.includes(expectedDateStr)) {
        currentStreakValue++;
        // Move to previous day
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return currentStreakValue;
  };

  const streak = calculateStreak(notes || []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setActiveTab("upload");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setActiveTab("upload");
    }
  };

  const handleStartPipeline = async () => {
    let fileToProcess = file;
    
    if (activeTab === "paste" && pasteText.trim() && !file) {
      const textBlob = new Blob([pasteText], { type: 'text/plain' });
      fileToProcess = new File([textBlob], `pasted-text-${Date.now()}.txt`, { type: 'text/plain' });
    }

    if (!fileToProcess) return;
    
    setIsProcessing(true);
    setErrorMessage("");
    
    try {
      let fileToUpload = fileToProcess;
      if (fileToProcess.type.startsWith("image/")) {
        fileToUpload = await compressImage(fileToProcess, 1500, 0.8);
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("instructions", instructions);
      formData.append("format", format);

      const res = await fetch("/api/transform", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setProcessingSuccess(true);
        decrementCredits(); // Subtract credit
        
        const noteId = data.id || Date.now().toString();
        const noteTitle = data.folderName || `${fileToUpload.name.split('.')[0]} Notes`;

        const newNote = {
          id: noteId,
          title: noteTitle,
          createdAt: new Date().toISOString(),
          folderId: null
        };
        setNotes([newNote, ...(notes || [])]);
        
        // Show success notification toast
        setToast({ show: true, noteId, noteTitle, formatRequested: data.formatRequested || format });
        
        setFile(null);
        setPasteText("");
        setInstructions("");

        // Auto-dismiss toast after 8 seconds
        setTimeout(() => {
          setToast((prev) => prev?.noteId === noteId ? null : prev);
        }, 8000);
      } else {
        throw new Error(data.error || "Failed to process the document.");
      }
    } catch (err: any) {
      console.error("Pipeline error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setProcessingSuccess(false);
      }, 4000);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    setActiveTab("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setFile(capturedFile);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] w-full py-8 px-4 relative max-w-5xl mx-auto">
      
      {/* Toast Notification Container */}
      {toast && toast.show && (
        <div className="fixed top-6 left-6 z-[99] max-w-sm w-full bg-white/85 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5.5 rounded-[2rem] flex items-start gap-4 border border-black/5 animate-in slide-in-from-left duration-300">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 flex items-center justify-center shrink-0 border border-amber-500/10 shadow-[0_4px_10px_rgba(245,158,11,0.15)] animate-pulse">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-black text-sm mb-1"><span className="text-gradient">Success!</span> <span>✨</span></h4>
            <p className="font-sans text-[13px] text-foreground/70 leading-relaxed font-medium">
              Note <span className="font-bold text-foreground">"{toast.noteTitle}"</span> generated!{" "}
              <Link href={toast.formatRequested === "Smart Flashcards" ? `/dashboard/flashcards/${toast.noteId}` : `/dashboard/notes/${toast.noteId}`} className="font-bold text-brand-3 underline underline-offset-4 decoration-brand-3/20 hover:decoration-brand-3 transition-all">
                Study Now 🚀
              </Link>
            </p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="w-6.5 h-6.5 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors shrink-0"
          >
            <X className="w-4 h-4 text-foreground/45" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="w-full mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif font-black text-3xl md:text-4xl mb-2 tracking-tight flex items-center gap-2 flex-wrap">
              <span className="text-gradient">Ready to focus, {currentUser?.name || "Aspirant"}?</span> <span>📚</span> <span>🎯</span>
            </h1>
            <p className="font-sans text-foreground/50 text-[15px] font-medium">
              Transform your chaotic notes into structured perfection.
            </p>
          </div>
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 px-5 py-2.5 rounded-2xl font-sans font-bold flex items-center gap-2.5 shadow-sm text-sm text-orange-600 hover:scale-105 transition-all duration-300">
            <Flame className="w-4.5 h-4.5 text-orange-500 fill-orange-500 animate-pulse" strokeWidth={2} /> 
            <span>{streak} Day Streak 🔥</span>
          </div>
        </div>
 
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="glass-panel border-t-2 border-t-brand-1 glow-card-brand-1 rounded-[1.5rem] p-5 flex flex-col justify-between group hover:scale-[1.03] transition-all">
            <div className="flex items-center gap-2 text-brand-1 font-sans font-extrabold text-[10px] uppercase tracking-wider mb-3">
              <div className="w-6 h-6 rounded-md bg-brand-1/10 flex items-center justify-center"><Zap className="w-3.5 h-3.5" /></div>
              <span>Credits Left</span>
            </div>
            <div className="font-serif font-black text-2xl text-brand-1">{currentUser?.credits ?? 5} <span className="opacity-55 text-sm font-sans font-bold">/ 5</span></div>
            <div className="w-full bg-brand-1/10 rounded-full h-1.5 mt-3.5 overflow-hidden">
              <div className="bg-brand-1 h-full rounded-full transition-all duration-500" style={{ width: `${((currentUser?.credits ?? 5) / 5) * 100}%` }}></div>
            </div>
          </div>

          <div className="glass-panel border-t-2 border-t-brand-2 glow-card-brand-2 rounded-[1.5rem] p-5 flex flex-col justify-between group hover:scale-[1.03] transition-all">
            <div className="flex items-center gap-2 text-brand-2 font-sans font-extrabold text-[10px] uppercase tracking-wider mb-3">
              <div className="w-6 h-6 rounded-md bg-brand-2/10 flex items-center justify-center"><FileText className="w-3.5 h-3.5" /></div>
              <span>Total Notes</span>
            </div>
            <div className="font-serif font-black text-2xl text-brand-2">{(notes || []).length} <span className="text-sm font-sans font-semibold text-brand-2/50">docs</span></div>
            <div className="text-[10px] text-brand-2/60 font-semibold mt-3.5 uppercase tracking-wider flex items-center gap-1"><span>📈</span> Logs synced</div>
          </div>

          <div className="glass-panel border-t-2 border-t-brand-3 glow-card-brand-3 rounded-[1.5rem] p-5 flex flex-col justify-between group hover:scale-[1.03] transition-all">
            <div className="flex items-center gap-2 text-brand-3 font-sans font-extrabold text-[10px] uppercase tracking-wider mb-3">
              <div className="w-6 h-6 rounded-md bg-brand-3/10 flex items-center justify-center"><Clock className="w-3.5 h-3.5" /></div>
              <span>Time Saved</span>
            </div>
            <div className="font-serif font-black text-2xl text-brand-3">~{((notes || []).length * 1.5).toFixed(1)} <span className="text-sm font-sans font-semibold text-brand-3/50">hrs</span></div>
            <div className="text-[10px] text-brand-3/60 font-semibold mt-3.5 uppercase tracking-wider flex items-center gap-1"><span>⚡</span> 1.5h per doc</div>
          </div>

          <div className="glass-panel border-t-2 border-t-brand-4 glow-card-brand-4 rounded-[1.5rem] p-5 flex flex-col justify-between group hover:scale-[1.03] transition-all">
            <div className="flex items-center gap-2 text-brand-4 font-sans font-extrabold text-[10px] uppercase tracking-wider mb-3">
              <div className="w-6 h-6 rounded-md bg-brand-4/10 flex items-center justify-center"><BarChart2 className="w-3.5 h-3.5" /></div>
              <span>Consistency</span>
            </div>
            <div className="font-serif font-black text-2xl text-brand-4">{streak} <span className="text-sm font-sans font-semibold text-brand-4/50">days</span></div>
            <div className="text-[10px] text-brand-4/60 font-semibold mt-3.5 uppercase tracking-wider flex items-center gap-1"><span>🔥</span> Streak active</div>
          </div>
        </div>
      </div>

      {/* Transformation Engine Block */}
      <div className="w-full glass-panel rounded-[2rem] p-6 sm:p-8 mb-12 flex flex-col lg:flex-row gap-6 md:gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
        
        {/* Left Side: Input Selection */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex bg-black/5 border border-black/5 p-1 rounded-2xl mb-6 max-w-md">
            <button 
              onClick={() => setActiveTab("upload")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 ${activeTab === "upload" ? "bg-white text-brand-3 shadow-md" : "text-foreground/45 hover:text-foreground"}`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload File
            </button>
            <button 
              onClick={() => { setPasteText(""); setActiveTab("paste"); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 ${activeTab === "paste" ? "bg-white text-brand-3 shadow-md" : "text-foreground/45 hover:text-foreground"}`}
            >
              <FileText className="w-3.5 h-3.5" /> Paste Text
            </button>
            <button 
              onClick={() => { setActiveTab("camera"); startCamera(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 ${activeTab === "camera" ? "bg-white text-brand-3 shadow-md" : "text-foreground/45 hover:text-foreground"}`}
            >
              <Camera className="w-3.5 h-3.5" /> Live Camera
            </button>
          </div>

          {/* Input Area based on Tab */}
          <div className="flex-1 min-h-[250px] sm:min-h-[350px] flex flex-col">
            {activeTab === "upload" && (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-1 flex flex-col items-center justify-center rounded-[2rem] p-8 text-center transition-all duration-400 relative overflow-hidden border-2 border-dashed ${isDragging ? 'border-brand-3 bg-brand-3/5' : 'border-black/10 hover:border-brand-3/40 hover:bg-black/[0.02]'} ${file ? 'bg-black/[0.02] border-solid border-black/10' : ''}`}
              >
                <input type="file" id="engine-upload" className="hidden" onChange={handleFileInput} accept="image/*,.pdf" />
                <label htmlFor="engine-upload" className="cursor-pointer flex flex-col items-center w-full h-full justify-center group">
                  <div className={`w-18 h-18 rounded-2.5xl flex items-center justify-center mb-4 transition-all duration-300 shadow-sm ${file ? 'bg-gradient-to-br from-brand-3 to-brand-4 text-white scale-110 shadow-brand-3/25' : 'bg-white text-foreground/40 group-hover:text-brand-3 group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgba(37,99,235,0.15)]'}`}>
                    {file ? <FileText className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
                  </div>
                  <h3 className="font-sans font-extrabold text-lg mb-1.5 text-foreground group-hover:text-brand-3 transition-colors">
                    {file ? file.name : "Select or drag a study file"}
                  </h3>
                  <p className="font-sans text-foreground/40 mb-6 text-xs font-semibold uppercase tracking-wider max-w-xs">
                    {file ? `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF, JPG, PNG up to 10MB"}
                  </p>
                  {!file && (
                    <span className="font-sans font-bold text-xs uppercase tracking-wider bg-white border border-black/10 text-foreground px-6 py-3 rounded-xl shadow-sm group-hover:shadow-md group-hover:bg-brand-3 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                      Browse Files 📂
                    </span>
                  )}
                </label>
              </div>
            )}

            {activeTab === "paste" && (
              <textarea 
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Type or paste your messy notes, class transcripts, or syllabus modules here to transform..."
                className="flex-1 w-full bg-black/[0.02] border border-black/10 rounded-[2rem] p-6 font-sans text-sm text-foreground focus:bg-white focus:ring-4 focus:ring-brand-3/15 focus:border-brand-3 focus:outline-none resize-none transition-all duration-300"
              ></textarea>
            )}

            {activeTab === "camera" && (
              <div className="flex-1 flex flex-col">
                 {isCameraOpen ? (
                   <div className="relative w-full flex-1 bg-black rounded-[2rem] overflow-hidden flex items-center justify-center shadow-inner border border-black/20">
                     <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                     <canvas ref={canvasRef} className="hidden"></canvas>
                     <button onClick={capturePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black font-sans font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:scale-105 hover:bg-brand-3 hover:text-white transition-all z-10">
                       <Camera className="w-4 h-4" /> Capture Photo 📸
                     </button>
                   </div>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-black/10 rounded-[2rem] bg-black/[0.02] hover:bg-black/5 hover:border-brand-3/30 transition-all duration-300">
                     {file ? (
                       <div className="text-center">
                         <div className="w-18 h-18 mx-auto rounded-3xl bg-gradient-to-br from-brand-3 to-brand-4 text-white flex items-center justify-center mb-4 shadow-md">
                           <FileText className="w-7 h-7" />
                         </div>
                         <h3 className="font-sans font-extrabold text-lg mb-1">Image Captured Successfully</h3>
                         <button onClick={startCamera} className="mt-2 font-sans text-xs text-brand-3 font-bold hover:underline uppercase tracking-wider transition-colors">Retake Photo 📸</button>
                       </div>
                     ) : (
                       <button onClick={startCamera} className="bg-white border border-black/10 text-foreground font-sans font-bold text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-sm hover:shadow-md hover:bg-brand-3 hover:text-white hover:border-transparent transition-all">
                         <Camera className="w-4 h-4" /> Open Camera 📸
                       </button>
                     )}
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Output Settings */}
        <div className="w-full lg:w-[350px] bg-black/[0.02] border border-black/5 rounded-[2rem] p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-black/5 text-foreground">
            <Settings2 className="w-4 h-4 text-foreground/50" />
            <h3 className="font-sans font-extrabold text-xs uppercase tracking-wider">Configuration</h3>
          </div>

          <div className="space-y-6 flex-1">
            {/* Format Selection */}
            <div>
              <h4 className="font-sans font-bold text-xs text-foreground/50 uppercase tracking-wider mb-3">Format Target</h4>
              <div className="flex flex-col gap-2.5">
                <label className={`flex items-center gap-3.5 p-4 rounded-2xl cursor-pointer transition-all border-2 ${format === "Markdown Notes" ? "bg-white border-brand-3 shadow-md scale-[1.01]" : "bg-white/40 border-transparent hover:bg-white hover:border-black/10"}`}>
                  <input type="radio" name="format" value="Markdown Notes" checked={format === "Markdown Notes"} onChange={(e) => setFormat(e.target.value)} className="hidden" />
                  <span className="text-xl">📝</span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-sans font-extrabold text-[14px] text-foreground leading-tight">Structured Notes</span>
                    <span className="font-sans text-[10px] text-foreground/45 mt-0.5 font-medium">Feynman, Formulas, Traps</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${format === "Markdown Notes" ? "border-brand-3 bg-brand-3 text-white" : "border-foreground/25"}`}>
                    {format === "Markdown Notes" && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </label>

                <label className={`flex items-center gap-3.5 p-4 rounded-2xl cursor-pointer transition-all border-2 ${format === "Smart Flashcards" ? "bg-white border-brand-3 shadow-md scale-[1.01]" : "bg-white/40 border-transparent hover:bg-white hover:border-black/10"}`}>
                  <input type="radio" name="format" value="Smart Flashcards" checked={format === "Smart Flashcards"} onChange={(e) => setFormat(e.target.value)} className="hidden" />
                  <span className="text-xl">🗂️</span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-sans font-extrabold text-[14px] text-foreground leading-tight">Smart Flashcards</span>
                    <span className="font-sans text-[10px] text-foreground/45 mt-0.5 font-medium">Anki-style study player</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${format === "Smart Flashcards" ? "border-brand-3 bg-brand-3 text-white" : "border-foreground/25"}`}>
                    {format === "Smart Flashcards" && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </label>

                <label 
                  onClick={(e) => {
                    e.preventDefault();
                    alert("The Practice Quiz feature is still incoming. Our developers are working hard to bring this in soon!");
                  }}
                  className={`flex items-center gap-3.5 p-4 rounded-2xl cursor-pointer transition-all border-2 bg-white/40 border-transparent hover:bg-white hover:border-black/10 opacity-60`}
                >
                  <input type="radio" name="format" value="Practice Quiz" disabled className="hidden" />
                  <span className="text-xl">✏️</span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-sans font-extrabold text-[14px] text-foreground leading-tight">Practice Quiz</span>
                    <span className="font-sans text-[10px] text-foreground/45 mt-0.5 font-medium">Coming soon...</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 border-foreground/25`}>
                  </div>
                </label>
              </div>
            </div>

            {/* Custom Instructions */}
            <div>
               <h4 className="font-sans font-bold text-xs text-foreground/50 uppercase tracking-wider mb-2">Study Guide Instructions</h4>
               <textarea 
                 value={instructions}
                 onChange={(e) => setInstructions(e.target.value)}
                 className="w-full bg-white border border-black/10 rounded-2xl p-4 font-sans text-xs text-foreground focus:ring-2 focus:ring-brand-3/40 focus:border-brand-3 focus:outline-none resize-none h-24 shadow-sm"
                 placeholder="Optional: Provide subject levels, target exams, specific concepts to cover..."
               ></textarea>
            </div>
          </div>

          <button 
            disabled={(!file && (!pasteText.trim() || activeTab !== "paste")) || isProcessing || processingSuccess}
            onClick={handleStartPipeline}
            className={`w-full py-4 mt-6 rounded-2xl font-sans font-bold text-sm flex items-center justify-center gap-2 transition-all relative overflow-hidden ${
              processingSuccess ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' :
              (file || (activeTab === "paste" && pasteText.trim())) && !isProcessing ? 'bg-gradient-to-r from-brand-3 via-brand-4 to-brand-3 text-white hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)] shadow-md hover:-translate-y-0.5 active:translate-y-0' : 
              'bg-black/5 text-foreground/30 cursor-not-allowed'
            }`}
          >
            {((file || (activeTab === "paste" && pasteText.trim())) && !isProcessing && !processingSuccess) && (
              <div className="absolute inset-0 shimmer-effect opacity-25 pointer-events-none"></div>
            )}
            {processingSuccess ? (
              <>Success! <CheckCircle2 className="w-4.5 h-4.5 animate-bounce" strokeWidth={2.5} /></>
            ) : isProcessing ? (
              <>
                 <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 Transforming Notes...
              </>
            ) : (
              <>
                 Transform Now ✨ <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </>
            )}
          </button>

          {isProcessing && (
            <p className="mt-3 text-center font-sans text-xs text-foreground/50 font-medium animate-pulse">
              If your document was too long, this may take a minute.
            </p>
          )}

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 font-sans text-[13px] text-center">
              {errorMessage}
            </div>
          )}
        </div>
      </div>

      {/* Recent Folders Section */}
      <div className="w-full mt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif font-black text-2xl text-foreground flex items-center gap-2">
            <Folder className="w-5.5 h-5.5 text-foreground/80" strokeWidth={1.5} /> Recent Folders
          </h2>
          <Link href="/dashboard/library" className="font-sans text-[13px] font-bold text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1 uppercase tracking-wider">
            View All <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
        
        {folders && folders.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {folders.slice(0, 4).map((folder: any) => (
              <Link href={`/dashboard/folder/${folder.id}`} key={folder.id} className="glass-panel hover:border-brand-3/20 rounded-[1.5rem] p-5 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group folder-card-glow">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-amber-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Folder className="w-5.5 h-5.5 transition-colors" strokeWidth={1.5} />
                </div>
                <div className="overflow-hidden mt-1">
                  <h3 className="font-sans font-bold text-[14px] text-foreground truncate mb-0.5 group-hover:text-brand-3 transition-colors">{folder.name}</h3>
                  <p className="font-sans text-[10px] text-foreground/40 font-semibold uppercase tracking-wider">{folder.date || "Active Study"}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full py-16 bg-white/40 border border-black/5 border-dashed rounded-3xl flex flex-col items-center justify-center">
             <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-black/5 flex items-center justify-center mb-4">
               <Folder className="w-6 h-6 text-foreground/30" strokeWidth={1.5} />
             </div>
             <h3 className="font-sans font-bold text-sm mb-1">No folders yet</h3>
             <p className="font-sans text-[13px] text-foreground/40 max-w-sm text-center">
               Create a folder from the sidebar or start transforming notes.
             </p>
          </div>
        )}
      </div>

    </div>
  );
}
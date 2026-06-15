# Notrik: AI Note Transformation SaaS — Complete Context Document

> **Last Updated:** June 13, 2026  
> **Purpose:** This file provides ALL context an AI model needs to continue development on the Notrik codebase. Read this ENTIRE document before writing any code.

---

## 1. What This App Is

**Notrik** is a premium, AI-powered note transformation SaaS platform for Indian competitive exam aspirants. Users upload messy handwritten notes, textbook photos, or raw text, and the AI transforms them into one of three output formats:

1. **Structured Notes** — Rich, modular academic documents with summaries, key concepts, formulas, diagrams, worked examples, common mistakes, active recall questions, and quick revision sections.
2. **Smart Flashcards** — AI-generated Anki-style flashcard decks with a full interactive study session player (3D flip animations, mastery tracking, difficulty tagging).
3. **Practice Quizzes** — *(Planned, not yet implemented.)*

---

## 2. Tech Stack (Exact Versions)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | `16.2.9` |
| Language | TypeScript | `^5` |
| React | React + React DOM | `19.2.4` |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` | `^4` / `^0.5.20` |
| Animations | Framer Motion | `^12.40.0` |
| AI Engine | `@google/generative-ai` | `^0.24.1` |
| Math Rendering | KaTeX + `rehype-katex` + `remark-math` | `^0.17.0` / `^7.0.1` / `^6.0.0` |
| Markdown | `react-markdown` + `remark-gfm` | `^10.1.0` / `^4.0.1` |
| Icons | Lucide React | `^1.17.0` |
| Fonts | Google Fonts: **Outfit** (headings/`font-serif`) + **Inter** (body/`font-sans`) | via `next/font/google` |
| Misc | `clsx`, `tailwind-merge`, `gsap` | various |

### Environment Variables
- `GEMINI_API_KEY` — Google Generative AI API key. Stored in `.env.local`. Never exposed to the client.
- `OPENROUTER_API_KEY` — API key for OpenRouter to access cheap/free models. Stored in `.env.local`. Never exposed to the client.

### AI Models Used
- **`gemini-2.5-flash`** ⚠️ **LOCKED** — Used in `/api/transform` route (note & flashcard generation). Configured with `responseMimeType: "application/json"`.
- **`gemini-2.5-flash`** (Native API) ⚠️ **LOCKED** — Used in `/api/chat` route (AI Mentor chatbot). This uses the native Gemini SDK and the `GEMINI_API_KEY`. It is currently the most capable supported model for the API key tier. **DO NOT change this model under any circumstance.** Only the project owner may change it by directly editing the source code. No env var, user input, or request body should ever be able to override it.

---

## 3. Business & Conceptual Vision (CRITICAL)

### Target Audience
Indian Competitive Exam Aspirants: **JEE, NEET, UPSC, CA/CS, GATE, Board Exams**. This is a massive, highly motivated market.

### The Problem
Organizing chaotic study materials (whiteboard photos, messy handwriting, dense textbooks) wastes thousands of hours. Existing international AI solutions are too expensive, lack local exam context, and don't support local payment methods.

### The Service
We do exactly ONE thing fantastically well: **Vision AI-powered note transformation** into Structured Notes, Smart Flashcards, and Practice Quizzes.

### Monetization
- **Localization:** Built specifically for India, priced in INR.
- **Affordability:** High volume, low margin SaaS. Severely undercuts international competitors.
- **Payments (Planned):** **Razorpay** for native **UPI transactions** (Google Pay, PhonePe, Paytm). Indian students rarely use international credit cards.
- **Tiered Pricing System:**
  - **Free Tier (₹0):** 5 transformations per week, limited AI Mentor Chat, basic notes/summaries, standard quality Vision API. (Saves ~5 hours/mo).
  - **Starter Tier (₹199/mo, or ₹159/mo billed annually):** 30 transformations/month, 25-30 chat messages/day, high-accuracy extraction, auto flashcards, standard priority. (Saves ~15 hours/mo).
  - **Aspirant Pro Tier (₹399/mo, or ₹319/mo billed annually):** 80 transformations/month, 150 chat messages/day, premium extraction (`gemini-2.5-flash`), priority queue, full export (PDF, MD, CSV), custom folder sorting. (Saves ~35 hours/mo).
  - **Unlimited Ranker Tier (₹799/mo, or ₹639/mo billed annually):** Unlimited transformations (150 soft limit fair use), unmetered AI chat, 1-on-1 AI mentorship, custom syllabus loading, trace drawer log access, instant priority queue. (Saves ~60 hours/mo).
  - **Founder's Circle Lifetime (₹7,999 one-time payment, regular ₹14,999):** Lifetime Aspirant Pro access + private community. Limited to the first 500 users.

- **Pricing Cards Styling & Visual Identity (Landing, Pricing, Checkout):**
  - **Free & Starter Cards:**
    - *Style:* Standard `glass-panel` bg (`bg-white/40`), border (`border-black/10` on pricing/checkout; `border-2 border-brand-3/20` on landing page), shadow-lg.
    - *Time-Savings Badges:* Green-themed for Free (`Saves ~5 hours/mo` in green-600 with green-50 bg/border); Blue-themed for Starter (`Saves ~15 hours/mo` in blue-600 with blue-50 bg/border).
    - *Action:* Outlined gray button.
  - **Aspirant Pro Card (Heavily Promoted):**
    - *Placement:* Off-center vertical translation (`transform md:-translate-y-6 hover:-translate-y-8`).
    - *Background:* Primary brand gradient `bg-gradient-to-br from-brand-3 via-brand-2 to-brand-1` with white text.
    - *Borders & Shadows:* Highlight border `border-2 border-brand-4` with deep blue ambient drop shadow `shadow-[0_20px_50px_rgba(30,58,138,0.35)]`.
    - *Features:* Gold/Yellow Recommended badge (`bg-yellow-400 text-brand-1 font-black uppercase tracking-widest`) with gold pulsing Star icons. Ambient glow bubble (`bg-brand-4/25 blur-[40px]`). Time savings badge (`Saves ~35 hours/mo` in yellow-300 with white/15 bg/border).
    - *Action:* Solid premium white button with dark royal brand text (`bg-white text-brand-1`) and arrow icon.
  - **Unlimited Ranker Card:**
    - *Background:* Slate navy gradient `bg-gradient-to-b from-brand-1/5 to-transparent`.
    - *Borders & Shadows:* Slate border (`border border-brand-1/30` on pricing/checkout; `border-2 border-brand-1/40` on landing page) with dark slate shadow (`shadow-2xl shadow-brand-1/20`).
    - *Features:* Crown icon (`text-brand-1`), time savings badge (`Saves ~60 hours/mo` in brand-1 with brand-1/10 bg/border).
    - *Action:* Dark slate outline button (`border-2 border-brand-1 text-brand-1 hover:bg-brand-1 hover:text-white`).
  - **Founder's Circle Lifetime Banner:**
    - *Style:* Full-width horizontal gradient container (`bg-gradient-to-r from-brand-3/20 via-brand-4/20 to-brand-1/20`) with border (`border border-brand-4/30`) and shadow-xl. Shows a strike-through price comparison (`₹7,999` vs `₹14,999`).

---

## 4. Complete Project Structure

```
src/
├── app/
│   ├── layout.tsx              # RootLayout (Outfit + Inter fonts, AuthProvider, ScrollObserver, global Chatbot)
│   ├── globals.css             # Design tokens, .glass-panel, 3D utilities, print styles, blob animations
│   ├── page.tsx                # Landing page (heavy scroll animations, before/after demo, FAQ, testimonials)
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Signup page
│   ├── onboarding/page.tsx     # Multi-step onboarding flow with Framer Motion
│   ├── features/page.tsx       # Features marketing page
│   ├── pricing/page.tsx        # Pricing page
│   ├── checkout/page.tsx       # Checkout page (Razorpay placeholder)
│   ├── payment/page.tsx        # Payment page
│   ├── exams/page.tsx          # Exam-specific landing pages
│   ├── contact/page.tsx        # Contact page
│   ├── privacy/page.tsx        # Privacy policy
│   ├── terms/page.tsx          # Terms of service
│   ├── note/[id]/              # Legacy public note viewer (uses mockDB, older code)
│   │   ├── page.tsx
│   │   └── study/              # Study tools sub-route
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard shell (sidebar, folder management, auth guard, DashboardContext)
│   │   ├── page.tsx            # Main dashboard (file upload/camera/paste, transform pipeline, stats)
│   │   ├── library/
│   │   │   ├── structured-notes/   # Library filtered to Structured Notes
│   │   │   └── smart-flashcards/   # Library filtered to Smart Flashcards
│   │   ├── notes/[id]/page.tsx     # Note detail page (routes to NoteViewer OR FlashcardDeckViewer)
│   │   ├── flashcards/[id]/        # Dedicated flashcard deck page
│   │   ├── folder/[id]/page.tsx    # Folder detail view
│   │   ├── subfolder/[id]/page.tsx # Subfolder detail view
│   │   ├── search/page.tsx         # Global search across all notes
│   │   ├── planner/page.tsx        # Study Planner (tasks, classes, assignments, exams — localStorage)
│   │   ├── trace/page.tsx          # Activity/trace log
│   │   ├── feedback/page.tsx       # User feedback form
│   │   ├── invite/page.tsx         # Invite & Earn referral page
│   │   ├── support/page.tsx        # Customer support page
│   │   └── settings/page.tsx       # User settings (profile, preferences)
│   └── api/
│       ├── transform/route.ts      # ★ CORE: Note/Flashcard generation pipeline (Gemini API)
│       ├── chat/route.ts           # AI Mentor chatbot (Gemini API)
│       ├── library/route.ts        # GET all notes, folders, subfolders
│       ├── feedback/route.ts       # POST user feedback (mock/log)
│       ├── folders/
│       │   ├── route.ts            # CRUD folders
│       │   └── [id]/route.ts       # DELETE specific folder
│       ├── subfolders/
│       │   ├── route.ts            # CRUD subfolders
│       │   └── [id]/route.ts       # DELETE specific subfolder
│       ├── notes/[id]/
│       │   ├── route.ts            # GET/DELETE individual note
│       │   └── export/
│       │       ├── csv/route.ts    # Export note as CSV (for Anki)
│       │       └── markdown/route.ts # Export note as Markdown (for Obsidian)
│       └── flashcards/
│           ├── route.ts            # POST/PUT/DELETE individual flashcards within a deck
│           ├── deck/route.ts       # Deck-level operations
│           └── move/route.ts       # Move flashcards between decks
├── components/
│   ├── Navbar.tsx                  # Global glassmorphic navbar
│   ├── Footer.tsx                  # Global footer
│   ├── Chatbot.tsx                 # Global AI Mentor chatbot (floating widget)
│   ├── RadialOrbitalTimeline.tsx   # Custom 4-step orbital animation (homepage)
│   ├── ScrollObserver.tsx          # Adds .is-scrolling class to body for glass-panel glow effects
│   ├── Features.tsx                # Features section component
│   ├── Hero.tsx                    # Hero section component
│   ├── ui/
│   │   └── hand-writing-text.tsx   # Handwriting-style animated text component
│   └── notes/
│       ├── NoteViewer.tsx          # ★ Structured Notes viewer (modular sections, export, print)
│       ├── FlashcardDeckViewer.tsx  # ★ Flashcard deck overview (stats, study modes, card grid)
│       ├── FlashcardPlayer.tsx     # ★ Interactive study session (3D flip, mastery controls, progress)
│       ├── ConceptCard.tsx         # Key concept card with drill-down
│       ├── FormulaCard.tsx         # Formula card with LaTeX rendering
│       ├── ExampleCard.tsx         # Worked example card
│       ├── QuestionCard.tsx        # Active recall question card
│       └── ExportModal.tsx         # Selective export modal (PDF/CSV/MD)
├── context/
│   └── AuthContext.tsx             # Auth state (localStorage-based mock auth with credits system)
├── lib/
│   ├── db.ts                       # ★ JSON file database (Notes, Folders, Subfolders CRUD)
│   ├── api.ts                      # Legacy mock API (uses mockDB.json, mostly unused now)
│   └── imageUtils.ts               # Client-side image compression before upload
└── data/
    ├── db.json                     # ★ Live database file (auto-created, gitignored ideally)
    └── mockDB.json                 # Legacy mock data (used by old /note/[id] route)
```

---

## 5. Core Feature: Note Transformation Pipeline

### How It Works (End-to-End)
1. **User uploads** a file (image/text/PDF) on `/dashboard` via drag-drop, camera capture, or text paste.
2. **Client-side compression** (`imageUtils.ts`): Images are resized to max 1500px and converted to JPEG at 80% quality to reduce API costs.
3. **API call** to `POST /api/transform` with `FormData` containing `file`, `instructions`, and `format`.
4. **Prompt switching**: The API route checks `format`:
   - `"Smart Flashcards"` → Uses flashcard-specific prompt producing `{ title, examRelevance, flashcards: [{id, front, back, difficulty}], tags }`.
   - Anything else → Uses structured notes prompt producing `{ title, examRelevance, summary, feynmanExplanation, keyConcepts, conceptRelations: { prerequisites, internalConnections, whatThisEnables, keyInsights }, formulas: [{ name, formula, whenToUse, commonMistake }], activeRecallQuestions: [{ question, hint }], examples: [{ problem, solution }], commonMistakes: [...], masteryOutcomes: { learningObjectives: [{ objective, whyItMatters, difficulty }], practiceSuggestions: [...] }, quickRevision, tags }`.
5. **Gemini API call** using `gemini-2.5-flash` (LOCKED) with `responseMimeType: "application/json"`. Includes retry logic (3 attempts with backoff for 503 errors).
6. **JSON parsing** with markdown code-block stripping.
7. **Cost estimation** in INR based on token usage.
8. **Database save** to `src/data/db.json` via `addNote()`.
9. **Client receives** `{ success, id, folderName, costEstimate }` and shows a success toast with a link to view.

### Database Schema (`src/lib/db.ts`)

```typescript
interface Note {
  id: string;
  userId: string;
  title: string;
  content: any;           // Structured JSON from Gemini (schema varies by format)
  sourceType: string;     // 'text' | 'image'
  formatRequested: string; // 'Markdown Notes' | 'Smart Flashcards' | 'Practice Quiz'
  tokensUsed: { prompt: number; candidates: number; total: number };
  estimatedCostINR: number;
  createdAt: string;
  folderId?: string | null;
  subfolderId?: string | null;
}

interface Folder { id: string; name: string; createdAt: string; }
interface Subfolder { id: string; folderId: string; name: string; createdAt: string; }
interface Database { notes: Note[]; folders: Folder[]; subfolders: Subfolder[]; }
```

The `db.ts` module also includes: `updateNoteContent()` (for editing flashcards), `updateNoteFolder()`, `ensureUnorganizedFlashcardsDeck()`, and full CRUD for folders/subfolders.

---

## 6. Core Feature: Smart Flashcards

### Generation
When `format === "Smart Flashcards"`, the API uses a specialized prompt that produces 10-15 flashcards per deck. Each card has `id`, `front`, `back`, and `difficulty` (Easy/Medium/Hard).

### Viewing (`FlashcardDeckViewer.tsx`)
When a user opens a note with `formatRequested === 'Smart Flashcards'`, the `notes/[id]/page.tsx` server component routes to `FlashcardDeckViewer` instead of `NoteViewer`. This shows:
- Deck header with title, tags, exam relevance
- Stats row: Total Cards, Mastered, Due for Review, Accuracy %
- Study Modes: Full Review, Due Today, Weak Areas
- Card grid preview (first 9 cards with difficulty badges)

### Study Session (`FlashcardPlayer.tsx`)
A fullscreen, immersive study experience:
- Centered glassmorphic card with **Framer Motion 3D flip** (`rotateY`)
- Front shows question/concept, back shows answer with LaTeX support
- Mastery controls: **Mastered** (green), **Review** (yellow), **Hard** (red)
- Navigation: Previous, Skip/Next, Flip (click card or press Space)
- Keyboard shortcuts: Space (flip), ArrowRight (next), ArrowLeft (prev)
- Progress bar showing cards reviewed
- Session stats in header (mastered/learning/hard counts)

### Flashcard CRUD API (`/api/flashcards/`)
- `POST` — Add a new card to a deck
- `PUT` — Edit a card's front, back, difficulty, or status
- `DELETE` — Remove a card from a deck
- `/deck/route.ts` — Deck-level operations
- `/move/route.ts` — Move cards between decks

---

## 7. Core Feature: Structured Notes Viewer

### Components
The `NoteViewer.tsx` orchestrates modular display of AI-generated content:
- **Summary** — Rendered with `react-markdown` + KaTeX
- **Feynman Explanation** — Simple-language explanation
- **Concept Relations and Dependencies** — Custom grid showing Prerequisites, Internal Connections, What This Enables, and Key Insights (replaces legacy Mermaid diagramming)
- **Key Concepts** — `ConceptCard.tsx` with drill-down to dedicated multi-column view
- **Formulas** — `FormulaCard.tsx` with LaTeX rendering
- **Worked Examples** — `ExampleCard.tsx`
- **Common Traps** — Red-themed warning section listing common conceptual or calculation mistakes
- **Mastery Outcomes** — "What You Should Be Able to Do Now" component showcasing Learning Objectives (categorized by Easy/Medium/Hard difficulty) and actionable Practice Suggestions
- **Active Recall** — `QuestionCard.tsx` with hint reveal
- **Quick Revision** — Dark-themed scannable bullet points

### Export System
- **ExportModal.tsx** — Glassmorphic UI for selecting sections to include (custom filtering prior to printing/exporting)
- **PDF** — Uses `window.print()` with heavy `@media print` customization in `globals.css` (features brand logo watermark, font size scale down to 11.5px to save pages, page-break-inside overrides)
- **CSV** — Server-side export via `/api/notes/[id]/export/csv` (for Anki import)
- **Markdown** — Server-side export via `/api/notes/[id]/export/markdown` (for Obsidian)

---

## 8. Authentication System

### Current Implementation (`src/context/AuthContext.tsx`)
- **localStorage-based mock auth** (no real backend auth yet)
- `login(email)` — Creates/loads user from localStorage
- `signup(name, email)` — Creates new user with 5 free credits
- `logout()` — Clears localStorage, redirects to `/`
- `updateProfile(name)` — Updates display name
- `decrementCredits()` — Subtracts 1 credit per transformation
- Dashboard layout has an **auth guard** that redirects to `/login` if not authenticated

### User Schema
```typescript
interface User {
  id: string; name: string; email: string;
  initials: string; plan: string; credits: number;
}
```

---

## 9. Dashboard Architecture

### Layout (`dashboard/layout.tsx`)
- **DashboardContext** provides: `folders`, `subfolders`, `notes`, `tasks`, `classes`, `assignments`, `exams` + their setters
- **Sidebar** with navigation: New Transformation, New Folder, Search, Library (with sub-nav for Structured Notes / Smart Flashcards), Activity, Study Planner, Feedback, Support, Invite & Earn
- **Quota widget** showing remaining free credits
- **Mobile responsive** with hamburger menu and slide-out sidebar
- Data fetched from `/api/library` on mount
- Planner data persisted to **localStorage** (`notrik_tasks`, `notrik_classes`, etc.)

### Main Dashboard Page (`dashboard/page.tsx`)
- **File input** with 3 tabs: Upload (drag & drop), Camera (live capture), Paste (text input)
- **Format selector**: Structured Notes, Smart Flashcards, Practice Quiz
- **Instructions field** for custom user prompts
- **Transform Now** button triggers the full pipeline
- **Stats section** with dynamic calculations: Total Notes, Study Time Saved, Current Streak (calculated from note creation dates)
- **Success toast** with link to view generated note

---

## 10. Design System & Visual Identity

### Color Palette (defined in `globals.css` `@theme`)
| Token | Value | Usage |
|-------|-------|-------|
| `brand-1` | `#0f172a` (Slate 900) | Deep navy, primary text |
| `brand-2` | `#1e3a8a` (Blue 900) | Dark royal, headings |
| `brand-3` | `#2563eb` (Blue 600) | Primary blue, CTAs |
| `brand-4` | `#3b82f6` (Blue 500) | Bright accent, highlights |
| `background` | `#ffffff` | Crisp white |
| `foreground` | `#0f172a` | Slate 900 text |

### Glass Panel System (`.glass-panel` in `globals.css`)
- `background: rgba(255, 255, 255, 0.45)` with `backdrop-filter: blur(40px)`
- Default border: `rgba(0, 0, 0, 0.12)` — clearly visible
- On scroll (`body.is-scrolling`): border glows `rgba(52, 134, 227, 0.5)` with blue box-shadow
- Navbar override: always `rgba(255, 255, 255, 0.85)` background, no glow

### 3D Utilities (for flashcard flips)
- `.perspective-1000`, `.preserve-3d`, `.backface-hidden`, `.rotate-y-180`

### Typography
- `font-serif` = Outfit (headings, elegant display text)
- `font-sans` = Inter (body text, UI labels, readability)

### Print Styles (`@media print`)
- Strips nav, footer, chatbot, blobs, noise overlay
- Scales font to 11.5px, reduces padding/margins
- Enforces `break-inside: avoid` on cards
- Visible borders on all glass panels
- Watermark: Notrik logo + text at 6% opacity, rotated -45°

---

## 11. API Routes Reference

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/transform` | POST | Core transformation pipeline (Gemini AI) |
| `/api/chat` | POST | AI Mentor chatbot conversations |
| `/api/library` | GET | Fetch all notes, folders, subfolders |
| `/api/folders` | POST | Create new folder |
| `/api/folders/[id]` | DELETE | Delete folder (orphans notes) |
| `/api/subfolders` | POST | Create subfolder |
| `/api/subfolders/[id]` | DELETE | Delete subfolder |
| `/api/notes/[id]` | GET/DELETE | Get or delete a specific note |
| `/api/notes/[id]/export/csv` | GET | Export note as Anki-compatible CSV |
| `/api/notes/[id]/export/markdown` | GET | Export note as Obsidian-compatible MD |
| `/api/flashcards` | POST/PUT/DELETE | CRUD individual flashcards in a deck |
| `/api/flashcards/deck` | POST | Deck-level operations |
| `/api/flashcards/move` | POST | Move flashcards between decks |
| `/api/feedback` | POST | Submit user feedback (mock/log) |

---

## 12. Instructions for Future Models

### A. Tech Stack Rules
- **Next.js 16+ App Router:** Use `async` server components. `params` is a `Promise` in dynamic routes (must `await`).
- **React 19:** Standard hooks only. No class components or deprecated patterns.
- **Tailwind CSS v4:** Uses `@theme` directive in `globals.css`. Use `@tailwindcss/typography` for markdown rendering.
- **Do NOT overwrite globals:** Never hardcode `border-white/20` on light themes. Use `.glass-panel`.

### B. Design Requirements (CRITICAL)
- **Premium SaaS aesthetic.** Every component must look "sturdy," expensive, polished, and academic. No MVP boxes.
- **Glassmorphism:** Always use `.glass-panel` class. Do not hardcode conflicting `backdrop-blur` or border utilities.
- **Framer Motion:** Required for all marketing page animations. Use `useScroll`/`useTransform` for scroll-bound effects.
- **Typography:** `font-serif` (Outfit) for headings, `font-sans` (Inter) for body.
- **Print constraints:** All new cards must have `print:break-inside-avoid`, `print:hidden` on interactive elements, `print:line-clamp-none` for full content.

### C. Backend & API Rules
- All AI integration goes through Next.js API routes. Never expose `GEMINI_API_KEY` (or OpenRouter keys) to the client.
- **Markdown over HTML** in AI outputs — keeps tokens low and rendering clean.
- **Math:** Use `$` for inline math, `$$` for display math. KaTeX + `remark-math` + `rehype-katex` for rendering.
- **No Diagrams/Mermaid:** Mermaid.js diagrams have been completely deprecated and removed to optimize visual presentation and reduce prompt token overhead. Use the `conceptRelations` JSON structure instead.
- **JSON escaping:** Backslashes in AI JSON output must be exactly double-escaped (`\\frac` in JSON string → `\frac` after parse). Never quad-escape.
- **Error masking:** Users never see raw API errors. Always provide friendly fallback messages.
- **Retry logic:** Transform API retries 3 times with backoff on 503 errors.

### D. Continuation Checklist
Before adding ANY new feature:
1. Read this entire `Gemini.MD` document.
2. Review `globals.css` for design tokens, `.glass-panel`, and print styles.
3. Review `src/lib/db.ts` for the database schema and available CRUD functions.
4. Review `src/app/api/transform/route.ts` to understand the AI pipeline and prompt structure.
5. Check `src/app/dashboard/layout.tsx` for the DashboardContext shape and sidebar navigation.
6. Review `NoteViewer.tsx` and `FlashcardDeckViewer.tsx` before building new content viewers.
7. Keep the business vision (Indian Aspirants, INR pricing, Razorpay/UPI) at the forefront.

### E. Known Technical Debt & Planned Work
- **Auth is mock (localStorage).** Must migrate to Supabase Auth.
- **Database is a JSON file.** Must migrate to Supabase PostgreSQL.
- **Practice Quiz format** is not yet implemented (only Structured Notes and Smart Flashcards work).
- **Razorpay integration** is not yet built (pricing/checkout pages are UI-only).
- **Flashcard spaced repetition** is session-only state. Must persist mastery data to DB.
- **`src/lib/api.ts`** and `src/data/mockDB.json` are legacy files from early prototyping. The real data layer is `src/lib/db.ts` + `src/data/db.json`.
- **`/note/[id]/page.tsx`** is a legacy public note viewer that still uses the old mock API. The real note viewer is at `/dashboard/notes/[id]/page.tsx`.

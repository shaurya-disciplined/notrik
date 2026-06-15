# Notrik: AI Note Transformation SaaS

**Notrik** is a premium, AI-powered note transformation platform designed for competitive exam aspirants. It takes chaotic study materials (like whiteboard photos, messy handwriting, or dense textbooks) and transforms them into highly structured, actionable study resources using Vision AI.

## 🚀 Features

- **Structured Notes:** Transforms messy inputs into rich, modular academic documents (summaries, formulas, common mistakes, active recall).
- **Smart Flashcards:** AI-generated Anki-style flashcard decks with an interactive 3D study session player.
- **AI Mentor:** Built-in chat assistant using Gemini to provide tutoring, Feynman explanations, and exam guidance.
- **Secure Authentication:** Integrated with Supabase for robust authentication and user data isolation.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router) v16+
- **Language:** TypeScript
- **UI & Styling:** React 19, Tailwind CSS v4, Framer Motion (Animations), Lucide React (Icons)
- **AI Engine:** Google Generative AI (`gemini-2.5-flash`)
- **Backend & Auth:** Supabase
- **Math Rendering:** KaTeX + `rehype-katex` + `remark-math`
- **Markdown Rendering:** `react-markdown` + `remark-gfm`

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/shaurya-disciplined/notrik.git
cd notrik
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your keys:
```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## 📝 License
This project is proprietary and intended for Notrik SaaS.

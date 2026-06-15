import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  LOCKED MODEL — DO NOT CHANGE                                      ║
// ║  The chatbot uses the native Gemini API with the cheapest available ║
// ║  supported model for this tier.                                     ║
// ║  Model: gemini-2.5-flash                                            ║
// ║  Key:   GEMINI_API_KEY (in .env.local)                              ║
// ║  DO NOT upgrade, swap, or override under any circumstance.          ║
// ║  Only the project owner may change this by editing this file.       ║
// ╚══════════════════════════════════════════════════════════════════════╝
const CHAT_MODEL = "gemini-2.5-flash" as const;

const SYSTEM_PROMPT =
  "You are the Notrik AI Mentor, an expert Indian competitive exam academic coach specializing in JEE, NEET, UPSC, and board exams. " +
  "Your goal is to explain concepts using the Feynman Technique, prioritize Active Recall, highlight common exam traps, and use proper LaTeX formatting for all math equations ($...$ for inline, $$...$$ for display). " +
  "Keep your responses engaging, well-structured using markdown, and directly helpful for students aiming for top ranks.";

export async function POST(req: Request) {
  try {
    // Authenticate the request — only logged-in users can use the AI Mentor
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to use the AI Mentor." },
        { status: 401 }
      );
    }

    const { history, message } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: CHAT_MODEL,
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Chat API Error:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}

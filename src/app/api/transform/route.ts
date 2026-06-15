import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { addNote, Note } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// Actual pricing for gemini-2.5-flash (June 2026) — LOCKED, do not change
// $0.30 per 1M input tokens => ~25.50 INR per 1M (@ ₹85/USD)
// $2.50 per 1M output tokens => ~212.50 INR per 1M (@ ₹85/USD)
const INPUT_COST_PER_MILLION_INR = 25.5;
const OUTPUT_COST_PER_MILLION_INR = 212.5;

export async function POST(req: Request) {
  try {
    // Authenticate the request — only logged-in users can transform
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to transform notes." },
        { status: 401 }
      );
    }

    // Server-side credit check — prevents client-side bypass
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (!profile || profile.credits <= 0) {
      return NextResponse.json(
        { error: "No transformation credits remaining. Please upgrade your plan." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const instructions = (formData.get("instructions") as string || "").slice(0, 2000); // Cap instruction length
    const format = formData.get("format") as string || "Markdown Notes";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Server-side file validation
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'text/plain', 'application/pdf'];
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF, TXT, PDF.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Enforce JSON output schema — Model LOCKED to gemini-2.5-flash (do not change)
    const TRANSFORM_MODEL = "gemini-2.5-flash" as const;
    const model = genAI.getGenerativeModel({ 
      model: TRANSFORM_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const buffer = await file.arrayBuffer();
    const isText = file.type === 'text/plain';
    let contentToSend: any[] = [];
    
    let prompt = "";

    if (format === "Smart Flashcards") {
      prompt = `You are an expert Indian competitive exam academic coach. You specialize in creating premium-quality, highly effective flashcard decks for students preparing for JEE, NEET, UPSC, GATE, CA, CS, Board exams, and other competitive exams.

Your flashcards must follow active recall and spaced repetition principles.
- Break down complex topics into bite-sized questions/concepts.
- Use simple, clear language on the front, and detailed (but concise) explanations on the back.
- Focus heavily on core formulas, exceptions, definitions, and common mistakes.

Output ONLY valid, clean JSON. Do not add any text before or after the JSON object.

Use this exact JSON structure:

{
  "title": "Clear and engaging title of the deck (e.g., Physics - Mechanics Flashcards)",
  "examRelevance": "1-2 sentences explaining why this topic is important for exams.",
  "flashcards": [
    {
      "id": "generate-a-unique-uuid-or-string-here",
      "front": "The question, term, or concept to remember.",
      "back": "The answer and explanation. Use proper LaTeX for all mathematics.",
      "difficulty": "Medium"
    }
  ],
  "tags": ["Relevant tags e.g. Physics, Mechanics, etc."]
}

### Strict Rules for Output Quality & Cost Control:

- **MATH DELIMITERS**: You MUST use $ for inline math (e.g., $x=2$) and $$ for display math (e.g., $$x=2$$). DO NOT use \\( ... \\) or \\[ ... \\] or plain parentheses for math. remark-math only recognizes $.
- **LATEX RULES**: Do NOT wrap math in Markdown code blocks. Never escape LaTeX outside of standard JSON string escaping requirements.
- **LINE BREAKS**: Use double newlines (\\n\\n) for paragraph breaks in markdown.
- Generate at least 10 to 15 high-quality flashcards. Do not create too few.
- Always use proper LaTeX syntax for all mathematics.
- Focus on Indian competitive exam context and common student pain points.
- Never output raw Markdown, HTML, or any text outside the JSON. Do NOT include any internal reasoning, <transform> tags, or conversational text. Output ONLY the final valid JSON.

CRITICAL JSON ESCAPING RULE:
To ensure LaTeX renders correctly, you must escape backslashes in JSON strings using exactly TWO backslashes (e.g., "\\\\frac"). This ensures JSON parses it as a single backslash ("\\frac"). Do NOT over-escape with four backslashes (e.g., "\\\\\\\\frac" is WRONG). Do NOT use single backslashes (e.g. "\\frac" is WRONG as it creates invalid JSON escapes).`;
    } else {
      // Default to Structured Notes
      prompt = `You are an expert Indian competitive exam academic coach. You specialize in creating premium-quality, scientifically effective study notes for students preparing for JEE, NEET, UPSC, GATE, CA, CS, Board exams, and other competitive exams.

Your notes must follow these evidence-based learning principles:
- Dual Coding Theory (combine clear text with visuals)
- Feynman Technique (explain concepts simply and clearly)
- Cornell Method structure (organized sections + active recall)
- Mind Mapping principles (hierarchy, connections, visual clarity)
- Strong focus on active recall, common exam mistakes, and exam relevance

Output ONLY valid, clean JSON. Do not add any text before or after the JSON object.

Use this exact JSON structure:

{
  "title": "Clear and engaging title of the topic",
  "examRelevance": "1-2 sentences explaining why this topic is important for JEE/NEET/UPSC/Boards/etc.",
  "summary": "A high-quality, concise 5-8 sentence overview written in simple language.",
  "feynmanExplanation": "Explain the core concept(s) in the simplest possible way, as if teaching a bright Class 12 student who is seeing this for the first time.",
  "keyConcepts": [
    {
      "concept": "Name of the concept",
      "explanation": "Clear explanation. Use proper LaTeX for all mathematics.",
      "importance": "High / Medium / Low"
    }
  ],
  "conceptRelations": {
    "prerequisites": ["List of concepts the student must already know"],
    "internalConnections": ["How concepts within this topic relate to each other"],
    "whatThisEnables": ["What future topics or skills this unlocks"],
    "keyInsights": ["2-4 deep, non-obvious connections or insights"]
  },
  "formulas": [
    {
      "name": "Name of the formula or concept",
      "formula": "The formula in proper LaTeX",
      "whenToUse": "When and in what conditions to use this formula",
      "commonMistake": "Common mistake students make with this"
    }
  ],
  "activeRecallQuestions": [
    {
      "question": "A high-quality question that tests understanding or application",
      "hint": "Optional short hint"
    }
  ],
  "examples": [
    {
      "problem": "A clear problem or scenario",
      "solution": "Step-by-step solution with explanations and proper LaTeX"
    }
  ],
  "commonMistakes": [
    "List the most frequent conceptual or calculation mistakes students make in this topic"
  ],
  "masteryOutcomes": {
    "learningObjectives": [
      {
        "objective": "A clear, actionable learning objective",
        "whyItMatters": "Why mastering this objective is important for exams",
        "difficulty": "Easy"
      }
    ],
    "practiceSuggestions": ["3-5 specific things the student should practice"]
  },
  "quickRevision": "A short, scannable bullet-point summary perfect for last-minute revision.",
  "tags": ["Relevant tags e.g. Physics, Mechanics, Laws of Motion, JEE Main, NEET, etc."]
}

### Strict Rules for Output Quality & Cost Control:

- **MATH DELIMITERS**: You MUST use $ for inline math (e.g., $x=2$) and $$ for display math (e.g., $$x=2$$). DO NOT use \\( ... \\) or \\[ ... \\] or plain parentheses for math. remark-math only recognizes $.
- **LATEX RULES**: Do NOT wrap math in Markdown code blocks. Never escape LaTeX outside of standard JSON string escaping requirements.
- **LINE BREAKS**: Use double newlines (\\n\\n) for paragraph breaks in markdown.
- **NO ASCII ART**: Do NOT generate ASCII art. Use text explanations only.
- Always use proper LaTeX syntax for all mathematics.
- Focus on Indian competitive exam context and common student pain points.
- Never output raw Markdown, HTML, or any text outside the JSON. Do NOT include any internal reasoning, <transform> tags, or conversational text. Output ONLY the final valid JSON.

CRITICAL JSON ESCAPING RULE:
To ensure LaTeX renders correctly, you must escape backslashes in JSON strings using exactly TWO backslashes (e.g., "\\\\frac"). This ensures JSON parses it as a single backslash ("\\frac"). Do NOT over-escape with four backslashes (e.g., "\\\\\\\\frac" is WRONG). Do NOT use single backslashes (e.g. "\\frac" is WRONG as it creates invalid JSON escapes).

Format Requested: ${format}. Please adjust the focus of the output based on this format preference.`;
    }
    
    if (instructions) {
      prompt += `\nSpecial User Instructions: ${instructions}`;
    }

    contentToSend.push(prompt);

    if (isText) {
      const textContent = Buffer.from(buffer).toString("utf-8");
      contentToSend.push(`\n\nSource Text:\n${textContent}`);
    } else {
      const base64Data = Buffer.from(buffer).toString("base64");
      contentToSend.push({
        inlineData: {
          data: base64Data,
          mimeType: file.type || "application/octet-stream",
        },
      });
    }

    let result;
    let retries = 3;
    let attempt = 0;
    while (attempt < retries) {
      try {
        result = await model.generateContent(contentToSend);
        break; // Success, break out of retry loop
      } catch (err: any) {
        attempt++;
        if (attempt >= retries || !err.message?.includes('503')) {
          throw err; // If we ran out of retries, or it's not a 503 error, throw it
        }
        console.warn(`Gemini API 503 Error. Retrying in ${attempt * 2}s... (Attempt ${attempt}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, attempt * 2000)); // Exponential-ish backoff
      }
    }

    if (!result) throw new Error("Failed to generate content after retries.");

    const response = result.response;
    const text = response.text();
    const usage = response.usageMetadata;

    // Parse JSON
    let parsedContent;
    try {
      // Remove potential markdown code block wrappers
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) cleanedText = cleanedText.replace(/^```json\n?/, '');
      else if (cleanedText.startsWith('```')) cleanedText = cleanedText.replace(/^```\n?/, '');
      if (cleanedText.endsWith('```')) cleanedText = cleanedText.replace(/\n?```$/, '');
      
      parsedContent = JSON.parse(cleanedText);
    } catch (e: any) {
      console.error("Failed to parse Gemini output as JSON", text);
      throw new Error(`AI returned invalid JSON structure: ${e.message}`);
    }

    // Calculate Costs
    let promptTokens = usage?.promptTokenCount || 0;
    let candidatesTokens = usage?.candidatesTokenCount || 0;
    let totalTokens = usage?.totalTokenCount || 0;
    
    let estimatedCostINR = 
      ((promptTokens / 1_000_000) * INPUT_COST_PER_MILLION_INR) +
      ((candidatesTokens / 1_000_000) * OUTPUT_COST_PER_MILLION_INR);

    // Save to DB
    const noteId = Date.now().toString();
    const note: Note = {
      id: noteId,
      userId: user.id,
      title: parsedContent.title || 'Untitled Notes',
      content: parsedContent,
      sourceType: isText ? 'text' : 'image',
      formatRequested: format,
      tokensUsed: { prompt: promptTokens, candidates: candidatesTokens, total: totalTokens },
      estimatedCostINR: estimatedCostINR,
      createdAt: new Date().toISOString()
    };

    await addNote(note);

    // Decrement credits server-side (authoritative — client decrement is just for UI)
    await supabase
      .from("profiles")
      .update({ credits: Math.max(0, profile.credits - 1) })
      .eq("id", user.id);

    return NextResponse.json({ 
      success: true, 
      id: note.id,
      folderName: note.title,
      costEstimate: estimatedCostINR,
      formatRequested: format
    });

  } catch (error: any) {
    console.error("Transformation API Error:", error.message || error);
    return NextResponse.json({ 
      error: "Failed to process document. Our servers might be busy, please try again." 
    }, { status: 500 });
  }
}

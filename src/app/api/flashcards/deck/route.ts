import { NextResponse } from "next/server";
import { addNote } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // Authenticate the request
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Deck title is required." }, { status: 400 });
    }

    const newDeck = {
      id: crypto.randomUUID(),
      userId: user.id,
      title: title.trim(),
      content: { flashcards: [], examRelevance: "Custom Manual Deck" },
      sourceType: "Manual",
      formatRequested: "Smart Flashcards",
      tokensUsed: { prompt: 0, candidates: 0, total: 0 },
      estimatedCostINR: 0,
      createdAt: new Date().toISOString()
    };

    await addNote(newDeck);

    return NextResponse.json({ success: true, deck: newDeck });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

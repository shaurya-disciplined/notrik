import { NextResponse } from "next/server";
import { getNotes, updateNoteContent, ensureUnorganizedFlashcardsDeck } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    // Authenticate the request
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sourceDeckId, targetDeckId, cardId } = await req.json();

    if (!sourceDeckId || !targetDeckId || !cardId) {
      return NextResponse.json({ error: "sourceDeckId, targetDeckId, and cardId are required." }, { status: 400 });
    }

    // Ensure the unorganized deck exists if that's the target
    if (targetDeckId === "unorganized-flashcards") {
      await ensureUnorganizedFlashcardsDeck(user.id);
    }
    if (sourceDeckId === "unorganized-flashcards") {
      await ensureUnorganizedFlashcardsDeck(user.id);
    }

    const notes = await getNotes();
    const sourceDeck = notes.find(n => n.id === sourceDeckId);
    const targetDeck = notes.find(n => n.id === targetDeckId);

    if (!sourceDeck || !targetDeck) {
      return NextResponse.json({ error: "Source or Target Deck not found." }, { status: 404 });
    }

    const sourceContent = sourceDeck.content || {};
    sourceContent.flashcards = sourceContent.flashcards || [];

    const targetContent = targetDeck.content || {};
    targetContent.flashcards = targetContent.flashcards || [];

    const cardIndex = sourceContent.flashcards.findIndex((c: any) => c.id === cardId);
    if (cardIndex === -1) {
      return NextResponse.json({ error: "Card not found in source deck." }, { status: 404 });
    }

    // Extract card and remove from source
    const [cardToMove] = sourceContent.flashcards.splice(cardIndex, 1);

    // Add to target
    targetContent.flashcards.push(cardToMove);

    // Save changes
    await updateNoteContent(sourceDeckId, sourceContent);
    await updateNoteContent(targetDeckId, targetContent);

    return NextResponse.json({ success: true, movedCard: cardToMove });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

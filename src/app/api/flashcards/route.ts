import { NextResponse } from "next/server";
import { getNotes, updateNoteContent } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { deckId, front, back, difficulty } = await req.json();

    if (!deckId || !front || !back) {
      return NextResponse.json({ error: "Deck ID, front, and back are required." }, { status: 400 });
    }

    const notes = await getNotes();
    const deck = notes.find(n => n.id === deckId);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found." }, { status: 404 });
    }

    const newCard = {
      id: crypto.randomUUID(),
      front,
      back,
      difficulty: difficulty || "Medium",
      status: "review", // default to need review
    };

    const content = deck.content || {};
    content.flashcards = content.flashcards || [];
    content.flashcards.push(newCard);

    await updateNoteContent(deckId, content);

    return NextResponse.json({ success: true, card: newCard });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { deckId, cardId, front, back, difficulty, status } = await req.json();

    if (!deckId || !cardId) {
      return NextResponse.json({ error: "Deck ID and Card ID are required." }, { status: 400 });
    }

    const notes = await getNotes();
    const deck = notes.find(n => n.id === deckId);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found." }, { status: 404 });
    }

    const content = deck.content || {};
    content.flashcards = content.flashcards || [];
    
    const cardIndex = content.flashcards.findIndex((c: any) => c.id === cardId);
    if (cardIndex === -1) {
      return NextResponse.json({ error: "Card not found." }, { status: 404 });
    }

    if (front !== undefined) content.flashcards[cardIndex].front = front;
    if (back !== undefined) content.flashcards[cardIndex].back = back;
    if (difficulty !== undefined) content.flashcards[cardIndex].difficulty = difficulty;
    if (status !== undefined) content.flashcards[cardIndex].status = status;

    await updateNoteContent(deckId, content);

    return NextResponse.json({ success: true, card: content.flashcards[cardIndex] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requireAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const deckId = searchParams.get("deckId");
    const cardId = searchParams.get("cardId");

    if (!deckId || !cardId) {
      return NextResponse.json({ error: "Deck ID and Card ID are required." }, { status: 400 });
    }

    const notes = await getNotes();
    const deck = notes.find(n => n.id === deckId);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found." }, { status: 404 });
    }

    const content = deck.content || {};
    content.flashcards = (content.flashcards || []).filter((c: any) => c.id !== cardId);

    await updateNoteContent(deckId, content);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

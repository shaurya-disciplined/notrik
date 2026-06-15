import db from '../data/mockDB.json';

// Types
export type User = typeof db.users[0];
export type Note = typeof db.notes[0];
export type Flashcard = typeof db.flashcards[0];

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  async getNotes(): Promise<Note[]> {
    await delay(500);
    return db.notes;
  },

  async getNote(id: string): Promise<Note | undefined> {
    await delay(300);
    return db.notes.find((n) => n.id === id);
  },

  async transformNote(file: File, context: string): Promise<Note> {
    await delay(2000); // Simulate AI processing
    const newNote: Note = {
      id: `n${Date.now()}`,
      userId: 'u1',
      title: context || 'Untitled Note',
      subject: context,
      createdAt: new Date().toISOString(),
      status: 'processed',
      content: "# " + (context || "Extracted Info") + "\\n\\nThis is a simulated transformation.\\n\\n```mermaid\\ngraph LR\\n A[Image Upload] --> B(Vision Extraction)\\n B --> C(Structuring)\\n C --> D[Rich Markdown]\\n```"
    };
    // In a real app, we'd save this to the DB
    return newNote;
  },

  async getFlashcards(noteId: string): Promise<Flashcard[]> {
    await delay(800);
    return db.flashcards.filter((f) => f.noteId === noteId);
  }
};

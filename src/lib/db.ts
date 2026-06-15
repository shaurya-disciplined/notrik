import { createClient } from './supabase/server';

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: any; // Structured JSON output from Gemini
  sourceType: string;
  formatRequested: string;
  tokensUsed: { prompt: number; candidates: number; total: number };
  estimatedCostINR: number;
  createdAt: string;
  folderId?: string | null; // Optional link to a folder
  subfolderId?: string | null; // Optional link to a subfolder
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface Subfolder {
  id: string;
  folderId: string; // parent folder ID
  name: string;
  createdAt: string;
}

// Mappers
const mapNoteFromDB = (dbNote: any): Note => ({
  id: dbNote.id,
  userId: dbNote.user_id,
  title: dbNote.title,
  content: dbNote.content,
  sourceType: dbNote.source_type,
  formatRequested: dbNote.format_requested,
  tokensUsed: dbNote.tokens_used,
  estimatedCostINR: dbNote.estimated_cost_inr,
  createdAt: dbNote.created_at,
  folderId: dbNote.folder_id,
  subfolderId: dbNote.subfolder_id,
});

const mapNoteToDB = (note: Note): any => ({
  id: note.id,
  user_id: note.userId,
  title: note.title,
  content: note.content,
  source_type: note.sourceType,
  format_requested: note.formatRequested,
  tokens_used: note.tokensUsed,
  estimated_cost_inr: note.estimatedCostINR,
  created_at: note.createdAt,
  folder_id: note.folderId || null,
  subfolder_id: note.subfolderId || null,
});

const mapFolderFromDB = (dbFolder: any): Folder => ({
  id: dbFolder.id,
  name: dbFolder.name,
  createdAt: dbFolder.created_at,
});

const mapSubfolderFromDB = (dbSubfolder: any): Subfolder => ({
  id: dbSubfolder.id,
  folderId: dbSubfolder.folder_id,
  name: dbSubfolder.name,
  createdAt: dbSubfolder.created_at,
});

/**
 * Helper: Gets the currently authenticated user or throws.
 * Used by write operations to ensure we always have a valid user_id.
 */
async function getAuthenticatedUser(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized: No valid user session.");
  }
  return user;
}

// ════════════════════════════════════════════════════════════════
// NOTES API
// RLS policies on the `notes` table ensure each user only sees
// their own rows, so we do NOT need a manual .eq('user_id', ...)
// filter on reads. Writes always set user_id from the session.
// ════════════════════════════════════════════════════════════════

export const addNote = async (note: Note) => {
  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  const noteToInsert = mapNoteToDB(note);
  noteToInsert.user_id = user.id; // Always override with session user

  const { error } = await supabase.from('notes').insert(noteToInsert);
  if (error) {
    console.error("Error adding note:", error);
    throw new Error(`Failed to save note: ${error.message}`);
  }
};

export const getNotes = async (): Promise<Note[]> => {
  const supabase = await createClient();
  // RLS ensures only the current user's notes are returned
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error getting notes:", error);
    return [];
  }
  return data ? data.map(mapNoteFromDB) : [];
};

export const deleteNote = async (id: string) => {
  const supabase = await createClient();
  // RLS ensures only the owner can delete their own notes
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) {
    console.error("Error deleting note:", error);
    throw new Error(`Failed to delete note: ${error.message}`);
  }
};

export const updateNoteFolder = async (noteId: string, folderId: string | null, subfolderId: string | null = null) => {
  const supabase = await createClient();
  // RLS ensures only the owner can update their own notes
  const { error } = await supabase.from('notes').update({
    folder_id: folderId,
    subfolder_id: subfolderId
  }).eq('id', noteId);
  if (error) {
    console.error("Error updating note folder:", error);
    throw new Error(`Failed to update note folder: ${error.message}`);
  }
};

// ════════════════════════════════════════════════════════════════
// FOLDERS API
// ════════════════════════════════════════════════════════════════

export const getFolders = async (): Promise<Folder[]> => {
  const supabase = await createClient();
  // RLS ensures only the current user's folders are returned
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error getting folders:", error);
    return [];
  }
  return data ? data.map(mapFolderFromDB) : [];
};

export const addFolder = async (folder: Folder) => {
  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  const { error } = await supabase.from('folders').insert({
    id: folder.id,
    user_id: user.id,
    name: folder.name,
    created_at: folder.createdAt,
  });
  if (error) {
    console.error("Error adding folder:", error);
    throw new Error(`Failed to create folder: ${error.message}`);
  }
};

export const deleteFolder = async (id: string) => {
  const supabase = await createClient();
  // RLS ensures only the owner can delete. CASCADE handles subfolders.
  // Notes with this folder_id will have folder_id set to NULL (ON DELETE SET NULL).
  const { error } = await supabase.from('folders').delete().eq('id', id);
  if (error) {
    console.error("Error deleting folder:", error);
    throw new Error(`Failed to delete folder: ${error.message}`);
  }
};

// ════════════════════════════════════════════════════════════════
// SUBFOLDERS API
// ════════════════════════════════════════════════════════════════

export const getSubfolders = async (): Promise<Subfolder[]> => {
  const supabase = await createClient();
  // RLS ensures only the current user's subfolders are returned
  const { data, error } = await supabase
    .from('subfolders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error getting subfolders:", error);
    return [];
  }
  return data ? data.map(mapSubfolderFromDB) : [];
};

export const addSubfolder = async (subfolder: Subfolder) => {
  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  const { error } = await supabase.from('subfolders').insert({
    id: subfolder.id,
    user_id: user.id,
    folder_id: subfolder.folderId,
    name: subfolder.name,
    created_at: subfolder.createdAt,
  });
  if (error) {
    console.error("Error adding subfolder:", error);
    throw new Error(`Failed to create subfolder: ${error.message}`);
  }
};

export const deleteSubfolder = async (id: string) => {
  const supabase = await createClient();
  // RLS ensures only the owner can delete their own subfolders
  const { error } = await supabase.from('subfolders').delete().eq('id', id);
  if (error) {
    console.error("Error deleting subfolder:", error);
    throw new Error(`Failed to delete subfolder: ${error.message}`);
  }
};

// ════════════════════════════════════════════════════════════════
// FLASHCARDS / CONTENT API
// ════════════════════════════════════════════════════════════════

export const updateNoteContent = async (noteId: string, content: any) => {
  const supabase = await createClient();
  // RLS ensures only the owner can update their own notes
  const { error } = await supabase.from('notes').update({ content }).eq('id', noteId);
  if (error) {
    console.error("Error updating note content:", error);
    throw new Error(`Failed to update note content: ${error.message}`);
  }
};

export const ensureUnorganizedFlashcardsDeck = async (userId: string): Promise<string> => {
  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);
  const actualUserId = user.id;
  
  // Try to find the deck (RLS filters by user)
  const { data: existingDecks, error: fetchError } = await supabase
    .from('notes')
    .select('id')
    .eq('id', 'unorganized-flashcards')
    .eq('user_id', actualUserId);

  if (fetchError) {
    console.error("Error fetching unorganized deck:", fetchError);
    return 'unorganized-flashcards';
  }

  if (existingDecks && existingDecks.length > 0) {
    return existingDecks[0].id;
  }

  // If not found, create it
  const newDeck: Note = {
    id: 'unorganized-flashcards',
    userId: actualUserId,
    title: 'Unorganized Flashcards',
    content: { flashcards: [], examRelevance: "Global holding area for flashcards not in a specific deck." },
    sourceType: "System",
    formatRequested: "Smart Flashcards",
    tokensUsed: { prompt: 0, candidates: 0, total: 0 },
    estimatedCostINR: 0,
    createdAt: new Date().toISOString()
  };

  await addNote(newDeck);
  return 'unorganized-flashcards';
};

import { NextResponse } from "next/server";
import { getNotes } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// Helper to escape CSV fields
function escapeCsv(field: string): string {
  if (!field) return '""';
  // Replace quotes with double quotes and wrap in quotes
  return `"${String(field).replace(/"/g, '""').replace(/\n/g, ' ')}"`;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const notes = await getNotes();
    const note = notes.find((n) => n.id === resolvedParams.id);

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const content = note.content;
    if (!content) {
      return new NextResponse("Invalid note content", { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const sectionsQuery = searchParams.get("sections");
    const selectedSections = sectionsQuery ? sectionsQuery.split(",") : null;

    let csvContent = "Front,Back\n";

    // Add Key Concepts
    if ((!selectedSections || selectedSections.includes('keyConcepts')) && content.keyConcepts && content.keyConcepts.length > 0) {
      content.keyConcepts.forEach((c: any) => {
        csvContent += `${escapeCsv(c.concept)},${escapeCsv(c.explanation)}\n`;
      });
    }

    // Add Formulas
    if ((!selectedSections || selectedSections.includes('formulas')) && content.formulas && content.formulas.length > 0) {
      content.formulas.forEach((f: any) => {
        const front = `Formula: ${f.name} <br><br> \\(${f.formula}\\)`;
        const back = `When to use: ${f.whenToUse} <br><br> Common Mistake: ${f.commonMistake}`;
        csvContent += `${escapeCsv(front)},${escapeCsv(back)}\n`;
      });
    }

    // Add Active Recall Questions
    if ((!selectedSections || selectedSections.includes('activeRecall')) && content.activeRecallQuestions && content.activeRecallQuestions.length > 0) {
      content.activeRecallQuestions.forEach((q: any) => {
        csvContent += `${escapeCsv(q.question)},${escapeCsv(q.hint)}\n`;
      });
    }

    const headers = new Headers();
    headers.set("Content-Type", "text/csv");
    headers.set("Content-Disposition", `attachment; filename="Notrik_Flashcards_${(note.title || 'export').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv"`);

    return new NextResponse(csvContent, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

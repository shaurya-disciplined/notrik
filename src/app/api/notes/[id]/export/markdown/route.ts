import { NextResponse } from "next/server";
import { getNotes } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

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

    let mdContent = `# ${content.title || note.title}\n\n`;
    
    if (content.tags && content.tags.length > 0) {
      mdContent += `**Tags:** ${content.tags.join(", ")}\n\n`;
    }

    if ((!selectedSections || selectedSections.includes('summary')) && content.summary) {
      mdContent += `## Summary\n${content.summary}\n\n`;
    }

    if ((!selectedSections || selectedSections.includes('feynman')) && content.feynmanExplanation) {
      mdContent += `## The Simple Explanation\n${content.feynmanExplanation}\n\n`;
    }

    if ((!selectedSections || selectedSections.includes('conceptRelations')) && content.conceptRelations) {
      mdContent += `## Concept Relations and Dependencies\n`;
      if (content.conceptRelations.prerequisites?.length > 0) {
        mdContent += `### Prerequisites\n${content.conceptRelations.prerequisites.map((p: string) => `- ${p}`).join('\n')}\n\n`;
      }
      if (content.conceptRelations.internalConnections?.length > 0) {
        mdContent += `### Internal Connections\n${content.conceptRelations.internalConnections.map((c: string) => `- ${c}`).join('\n')}\n\n`;
      }
      if (content.conceptRelations.whatThisEnables?.length > 0) {
        mdContent += `### What This Enables\n${content.conceptRelations.whatThisEnables.map((w: string) => `- ${w}`).join('\n')}\n\n`;
      }
      if (content.conceptRelations.keyInsights?.length > 0) {
        mdContent += `### Key Insights\n${content.conceptRelations.keyInsights.map((k: string) => `- ${k}`).join('\n')}\n\n`;
      }
    }

    if ((!selectedSections || selectedSections.includes('keyConcepts')) && content.keyConcepts && content.keyConcepts.length > 0) {
      mdContent += `## Key Concepts\n`;
      content.keyConcepts.forEach((c: any) => {
        mdContent += `### ${c.concept}\n**Importance:** ${c.importance}\n\n${c.explanation}\n\n`;
      });
    }

    if ((!selectedSections || selectedSections.includes('formulas')) && content.formulas && content.formulas.length > 0) {
      mdContent += `## Important Formulas\n`;
      content.formulas.forEach((f: any) => {
        mdContent += `### ${f.name}\n$$${f.formula}$$\n\n**When to Use:** ${f.whenToUse}\n\n**Common Mistake:** ${f.commonMistake}\n\n`;
      });
    }

    if ((!selectedSections || selectedSections.includes('examples')) && content.examples && content.examples.length > 0) {
      mdContent += `## Worked Examples\n`;
      content.examples.forEach((ex: any) => {
        mdContent += `### Problem\n${ex.problem}\n\n### Solution\n${ex.solution}\n\n`;
      });
    }

    if ((!selectedSections || selectedSections.includes('mistakes')) && content.commonMistakes && content.commonMistakes.length > 0) {
      mdContent += `## Common Traps\n`;
      content.commonMistakes.forEach((m: string) => {
        mdContent += `- ${m}\n`;
      });
      mdContent += `\n`;
    }

    if ((!selectedSections || selectedSections.includes('masteryOutcomes')) && content.masteryOutcomes) {
      mdContent += `## What You Should Be Able to Do Now\n`;
      if (content.masteryOutcomes.learningObjectives?.length > 0) {
        mdContent += `### Learning Objectives\n`;
        content.masteryOutcomes.learningObjectives.forEach((obj: any) => {
          mdContent += `- **${obj.objective}** (${obj.difficulty})\n  *Why it matters:* ${obj.whyItMatters}\n`;
        });
        mdContent += `\n`;
      }
      if (content.masteryOutcomes.practiceSuggestions?.length > 0) {
        mdContent += `### Practice Suggestions\n${content.masteryOutcomes.practiceSuggestions.map((p: string) => `- ${p}`).join('\n')}\n\n`;
      }
    }

    if ((!selectedSections || selectedSections.includes('activeRecall')) && content.activeRecallQuestions && content.activeRecallQuestions.length > 0) {
      mdContent += `## Active Recall\n`;
      content.activeRecallQuestions.forEach((q: any) => {
        mdContent += `- **Q:** ${q.question}\n  **Hint:** ${q.hint}\n`;
      });
      mdContent += `\n`;
    }

    if ((!selectedSections || selectedSections.includes('quickRevision')) && content.quickRevision) {
      mdContent += `## Quick Revision\n${content.quickRevision}\n\n`;
    }

    const headers = new Headers();
    headers.set("Content-Type", "text/markdown");
    headers.set("Content-Disposition", `attachment; filename="Notrik_Note_${(note.title || 'export').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md"`);

    return new NextResponse(mdContent, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

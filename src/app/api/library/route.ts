import { NextResponse } from "next/server";
import { getNotes, getFolders, getSubfolders } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Verify user is authenticated before returning data
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const notes = await getNotes();
    const folders = await getFolders();
    const subfolders = await getSubfolders();
    
    return NextResponse.json({ 
      success: true, 
      notes, 
      folders,
      subfolders
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

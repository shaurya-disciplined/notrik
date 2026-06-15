import { NextResponse } from "next/server";
import { addSubfolder } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, folderId } = await req.json();
    if (!name) return NextResponse.json({ error: "Subfolder name is required" }, { status: 400 });
    if (!folderId) return NextResponse.json({ error: "Parent folder ID is required" }, { status: 400 });

    const newSubfolder = {
      id: crypto.randomUUID(),
      folderId,
      name,
      createdAt: new Date().toISOString()
    };

    await addSubfolder(newSubfolder);
    
    return NextResponse.json({ success: true, subfolder: newSubfolder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

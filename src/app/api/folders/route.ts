import { NextResponse } from "next/server";
import { addFolder } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Folder name is required" }, { status: 400 });

    const newFolder = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString()
    };

    await addFolder(newFolder);
    
    return NextResponse.json({ success: true, folder: newFolder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

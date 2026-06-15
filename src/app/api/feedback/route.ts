import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Authenticate the request
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // In a real application, you'd insert into Supabase here.
    // For now, we'll just log it and return success to mock the backend.
    console.log("Feedback Received:", data);

    return NextResponse.json({ success: true, message: "Feedback received successfully" });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit feedback" }, { status: 500 });
  }
}

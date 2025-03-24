// modal-ui/app/api/upload/route.ts (App Router)

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role only in secure backend
);

export async function POST(req: Request) {
  const problem = await req.json();

  if (!problem || !problem.title || !problem.solution) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("leetdoc").insert([problem]);

  if (error) {
    console.error("❌ Supabase insert error:", error);
    return NextResponse.json(
      { error: "Failed to upload problem." },
      { status: 500 }
    );
  }

  console.log(`✅ Uploaded: ${problem.title}`);
  return NextResponse.json({ success: true, data });
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("maxx_export_intake_context", {
    p_submission_id: id,
  });

  if (error) {
    const status =
      error.code === "42501" ? 403 :
      error.code === "P0002" ? 404 :
      500;
    return NextResponse.json({ error: error.message }, { status });
  }

  const body = JSON.stringify(data, null, 2);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="maxx-intake-${id}.json"`,
      "Cache-Control": "no-store",
    },
  });
}

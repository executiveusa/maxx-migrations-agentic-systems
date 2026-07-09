import { NextRequest, NextResponse } from "next/server";
import { parseCsv } from "@/lib/import/ghl/csv-parser";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  let csvText: string;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    csvText = await file.text();
  } else {
    const body = await request.json();
    csvText = body.csvText ?? "";
  }

  if (!csvText.trim()) {
    return NextResponse.json({ error: "CSV content is empty." }, { status: 400 });
  }

  const parsed = parseCsv(csvText);
  return NextResponse.json({ headers: parsed.headers, rowCount: parsed.rows.length, rows: parsed.rows });
}

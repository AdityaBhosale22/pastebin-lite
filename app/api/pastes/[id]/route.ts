import { NextRequest, NextResponse } from "next/server";
import kv from "@/lib/kv";

type Paste = {
  id: string;
  content: string;
  createdAt: number;
  expiresAt: number | null;
  maxViews: number | null;
  viewsUsed: number;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } 
): Promise<Response> {
  const { id } = await context.params; 

  const paste = await kv.get<Paste>(`paste:${id}`);

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now =
    process.env.TEST_MODE === "1"
      ? Number(request.headers.get("x-test-now-ms")) || Date.now()
      : Date.now();

  if (paste.expiresAt && now > paste.expiresAt) {
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
  }

  paste.viewsUsed += 1;
  await kv.set(`paste:${id}`, paste);

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.maxViews !== null
        ? Math.max(paste.maxViews - paste.viewsUsed, 0)
        : null,
    expires_at: paste.expiresAt
      ? new Date(paste.expiresAt).toISOString()
      : null,
  });
}
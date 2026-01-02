import { NextResponse } from "next/server";
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
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const key = `paste:${id}`;

  const paste = await kv.get<Paste>(key);

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  const now =
    process.env.TEST_MODE === "1"
      ? Number(_req.headers.get("x-test-now-ms")) || Date.now()
      : Date.now();

  if (paste.expiresAt && now > paste.expiresAt) {
    return NextResponse.json(
      { error: "Paste expired" },
      { status: 404 }
    );
  }

  if (
    paste.maxViews !== null &&
    paste.viewsUsed >= paste.maxViews
  ) {
    return NextResponse.json(
      { error: "View limit exceeded" },
      { status: 404 }
    );
  }

  paste.viewsUsed += 1;
  await kv.set(key, paste);

  const remainingViews =
    paste.maxViews !== null
      ? Math.max(paste.maxViews - paste.viewsUsed, 0)
      : null;

  return NextResponse.json(
    {
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expiresAt
        ? new Date(paste.expiresAt).toISOString()
        : null,
    },
    { status: 200 }
  );
}

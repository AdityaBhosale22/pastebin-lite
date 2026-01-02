import { NextResponse } from "next/server";
import kv from "@/lib/kv";

export async function GET() {
  try {
    await kv.set("healthz", "ok");

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}

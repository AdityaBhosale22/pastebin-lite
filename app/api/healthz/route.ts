import { NextResponse } from "next/server";
import kv from "@/lib/kv";

export async function GET() {
  try {
    await kv.set("healthz-test", "ok");
    const value = await kv.get("healthz-test");

    return NextResponse.json(
      { ok: true, kv: value },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "KV not connected" },
      { status: 500 }
    );
  }
}

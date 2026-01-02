import { notFound } from "next/navigation";

type PasteResponse = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

async function fetchPaste(id: string): Promise<PasteResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Paste not found");
  }

  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  let paste: PasteResponse;

  try {
    paste = await fetchPaste(params.id);
  } catch {
    notFound();
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Paste</h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        {paste.content}
      </pre>

      <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
        {paste.remaining_views !== null && (
          <p>Remaining views: {paste.remaining_views}</p>
        )}
        {paste.expires_at && (
          <p>Expires at: {new Date(paste.expires_at).toLocaleString()}</p>
        )}
      </div>
    </main>
  );
}
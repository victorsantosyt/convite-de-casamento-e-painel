// Rota /api/contributions — presentes e contribuições PIX.
//   POST   (público) : registra uma contribuição
//   GET    (admin)   : lista todas as contribuições
//   DELETE (admin)   : remove uma contribuição por id (?id=...)
import { getStore } from "@netlify/blobs";
import { json, isAdmin, readAll, makeId } from "./_shared.mjs";

export default async (req) => {
  const store = getStore("contributions");

  // ── Registro de contribuição (público) ───────────────
  if (req.method === "POST") {
    let payload;
    try {
      payload = await req.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }

    const name = String(payload?.name || "").trim().slice(0, 80);
    const type = payload?.type === "pix" ? "pix" : "gift";
    const description = String(payload?.description || "").trim().slice(0, 120);
    const amount = String(payload?.amount || "").trim().slice(0, 40);
    if (!name) return json({ error: "name_required" }, 400);

    const entry = {
      id: makeId(),
      type,
      name,
      description,
      amount,
      ts: new Date().toISOString(),
    };
    await store.setJSON(entry.id, entry);
    return json({ ok: true, entry }, 201);
  }

  // ── A partir daqui exige autenticação de admin ───────
  if (!isAdmin(req)) return json({ error: "unauthorized" }, 401);

  if (req.method === "GET") {
    const contributions = await readAll(store);
    return json({ contributions });
  }

  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return json({ error: "id_required" }, 400);
    await store.delete(id);
    return json({ ok: true });
  }

  return json({ error: "method_not_allowed" }, 405);
};

export const config = { path: "/api/contributions" };

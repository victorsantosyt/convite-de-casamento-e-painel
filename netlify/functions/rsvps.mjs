// Rota /api/rsvps — confirmações de presença.
//   POST   (público) : grava uma confirmação/recusa
//   GET    (admin)   : lista todas as confirmações
//   DELETE (admin)   : remove uma confirmação por id (?id=...)
import { getStore } from "@netlify/blobs";
import { json, isAdmin, readAll, makeId } from "./_shared.mjs";

export default async (req) => {
  const store = getStore("rsvps");

  // ── Convidado confirma/recusa (público) ──────────────
  if (req.method === "POST") {
    let payload;
    try {
      payload = await req.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }

    const name   = String(payload?.name || "").trim().slice(0, 80);
    const status = payload?.status === "declined" ? "declined" : "accepted";
    if (!name) return json({ error: "name_required" }, 400);

    const validSides = ["noivo", "noiva", "indefinido"];
    const side  = validSides.includes(payload?.side) ? payload.side : "indefinido";
    const group = String(payload?.group || "indefinido").slice(0, 40);

    const entry = { id: makeId(), name, status, side, group, ts: new Date().toISOString() };
    await store.setJSON(entry.id, entry);
    return json({ ok: true, entry }, 201);
  }

  // ── A partir daqui exige autenticação de admin ───────
  if (!isAdmin(req)) return json({ error: "unauthorized" }, 401);

  if (req.method === "GET") {
    const rsvps = await readAll(store);
    return json({ rsvps });
  }

  if (req.method === "DELETE") {
    const params = new URL(req.url).searchParams;
    if (params.get("all") === "true") {
      const { blobs } = await store.list();
      await Promise.all(blobs.map((b) => store.delete(b.key)));
      return json({ ok: true, cleared: blobs.length });
    }
    const id = params.get("id");
    if (!id) return json({ error: "id_required" }, 400);
    await store.delete(id);
    return json({ ok: true });
  }

  return json({ error: "method_not_allowed" }, 405);
};

export const config = { path: "/api/rsvps" };

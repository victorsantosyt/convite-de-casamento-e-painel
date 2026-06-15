// Helpers compartilhados pelas funções (rsvps e contributions).

// Token de administrador. Defina ADMIN_TOKEN nas variáveis de ambiente do
// Netlify para um valor forte. Se não definido, usa "0808" (PIN padrão).
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "0808";

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

// Confere o cabeçalho x-admin-token enviado pelo painel.
export function isAdmin(req) {
  const token = req.headers.get("x-admin-token") || "";
  return token.length > 0 && token === ADMIN_TOKEN;
}

// Lê todos os registros de um store do Blobs, ordenados por data (ts).
export async function readAll(store) {
  const { blobs } = await store.list();
  const items = await Promise.all(
    blobs.map((b) => store.get(b.key, { type: "json" })),
  );
  return items
    .filter(Boolean)
    .sort((a, b) => (a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0));
}

// Gera um id curto e único para cada registro.
export function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ==============================================
   Convite de Casamento — Stephanny & Victor
   08 de Agosto de 2026 | Água Boa - MT
   ============================================== */

// ── CONFIGURAÇÃO ─────────────────────────────────
// Atualize com o número de WhatsApp dos noivos:
// Formato: 55 + DDD + número (só dígitos, sem espaço)
// Exemplo: "5566999990000" = Brasil (55) + DDD 66 + número
const WHATSAPP_NOIVOS = "556698130-9903"; // ← ATUALIZE AQUI

const WEDDING_DATE = new Date("2026-08-08T18:00:00");
const STORAGE_KEYS = { rsvps: "sv_rsvps", contributions: "sv_contributions" };

// ── Storage ─────────────────────────────────────
function loadList(key) {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS[key]) || "[]");
  } catch {
    return [];
  }
}

function saveList(key, list) {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(list));
  } catch {
    // localStorage indisponível
  }
}

// ── Toast ────────────────────────────────────────
const toastEl = document.getElementById("toast");
let toastTimer = null;

function toast(msg, type = "info", ms = 3800) {
  if (!toastEl) return;
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.className = `toast ${type} show`;
  toastTimer = setTimeout(() => { toastEl.className = "toast"; }, ms);
}

// ── Contagem Regressiva ──────────────────────────
const els = {
  days:  document.getElementById("t-days"),
  hours: document.getElementById("t-hours"),
  min:   document.getElementById("t-min"),
  sec:   document.getElementById("t-sec"),
};

function pad(n) { return String(n).padStart(2, "0"); }

function tick() {
  const diff = WEDDING_DATE - Date.now();

  if (diff <= 0) {
    Object.values(els).forEach((el) => { if (el) el.textContent = "00"; });
    const label = document.querySelector(".countdown-label");
    if (label) label.textContent = "Chegou o grande dia!";
    return;
  }

  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  const s = Math.floor((diff % 6e4) / 1e3);

  if (els.days)  els.days.textContent  = pad(d);
  if (els.hours) els.hours.textContent = pad(h);
  if (els.min)   els.min.textContent   = pad(m);
  if (els.sec)   els.sec.textContent   = pad(s);
}

tick();
setInterval(tick, 1000);

// ── Modal engine ─────────────────────────────────
function openModal(modal) {
  if (!modal) return;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  const focusable = modal.querySelector("input, button");
  if (focusable) setTimeout(() => focusable.focus(), 80);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  document.querySelectorAll(".modal.open").forEach((m) => {
    if (e.target === m) closeModal(m);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll(".modal.open").forEach(closeModal);
});

document.querySelectorAll(".close-modal").forEach((btn) => {
  btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
});

// ── WhatsApp CTA após RSVP ───────────────────────
function addWhatsAppCTA(name, status) {
  const form = document.getElementById("rsvpForm");
  if (!form || document.getElementById("waBtn")) return;

  const msg = status === "accepted"
    ? `Olá Stephanny e Victor! Confirmo minha presença no casamento de vocês em 08/08/2026. — ${name}`
    : `Olá Stephanny e Victor! Infelizmente não poderei comparecer ao casamento de vocês em 08/08/2026. — ${name}`;

  const link = document.createElement("a");
  link.id        = "waBtn";
  link.href      = `https://wa.me/${WHATSAPP_NOIVOS}?text=${encodeURIComponent(msg)}`;
  link.target    = "_blank";
  link.rel       = "noopener noreferrer";
  link.className = "btn-whatsapp";
  link.innerHTML =
    '<i class="ph-light ph-whatsapp-logo btn-icon" aria-hidden="true"></i> Avisar pelo WhatsApp';

  form.appendChild(link);
}

// ── RSVP ────────────────────────────────────────
const nameInput  = document.getElementById("guestName");
const acceptBtn  = document.getElementById("acceptBtn");
const declineBtn = document.getElementById("declineBtn");

function submitRSVP(status) {
  const name = nameInput ? nameInput.value.trim() : "";

  if (!name) {
    toast("Por favor, informe seu nome antes de confirmar.", "error");
    if (nameInput) nameInput.focus();
    return;
  }

  const list = loadList("rsvps");
  const idx  = list.findIndex((r) => r.name.toLowerCase() === name.toLowerCase());
  const entry = { name, status, ts: new Date().toISOString() };

  if (idx >= 0) {
    list[idx] = entry;
  } else {
    list.push(entry);
  }
  saveList("rsvps", list);

  addWhatsAppCTA(name, status);

  const first = name.split(" ")[0];

  if (status === "accepted") {
    toast(`Presença confirmada! Obrigado, ${first}! Nos vemos em breve!`, "success");
    if (acceptBtn)  { acceptBtn.textContent = "Presença Confirmada!"; acceptBtn.disabled = true; }
    if (declineBtn) declineBtn.disabled = true;
  } else {
    toast(`Entendemos, ${first}. Sentiremos sua falta!`, "info");
    if (declineBtn) { declineBtn.textContent = "Recusa Registrada"; declineBtn.disabled = true; }
    if (acceptBtn)  acceptBtn.disabled = true;
  }

  if (nameInput) nameInput.disabled = true;
}

if (acceptBtn)  acceptBtn .addEventListener("click", () => submitRSVP("accepted"));
if (declineBtn) declineBtn.addEventListener("click", () => submitRSVP("declined"));

// ── Modal PIX ────────────────────────────────────
const pixModal = document.getElementById("pixModal");
const pixBtn   = document.getElementById("pixBtn");
const copyBtn  = document.getElementById("copyPixBtn");
const pixKeyEl = document.getElementById("pixKey");

if (pixBtn) pixBtn.addEventListener("click", () => openModal(pixModal));

if (copyBtn && pixKeyEl) {
  copyBtn.addEventListener("click", async () => {
    const key = pixKeyEl.textContent.trim();

    const copied = await (async () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try { await navigator.clipboard.writeText(key); return true; }
        catch { /* fallback */ }
      }
      const ta = Object.assign(document.createElement("textarea"), {
        value: key,
        style: "position:fixed;opacity:0;pointer-events:none;",
      });
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    })();

    if (copied) {
      copyBtn.textContent = "Chave Copiada!";
      toast("Chave PIX copiada! Cole no app do seu banco.", "success");
      setTimeout(() => { copyBtn.textContent = "Copiar Chave PIX"; }, 2800);
    } else {
      toast("Não foi possível copiar. Selecione a chave manualmente.", "error");
    }
  });

  if (pixKeyEl.parentElement) {
    pixKeyEl.parentElement.addEventListener("click", () => copyBtn.click());
  }
}

// ── Modal Presentes ───────────────────────────────
const giftModal = document.getElementById("giftModal");
const giftBtn   = document.getElementById("giftBtn");
const giftForm  = document.getElementById("giftForm");

if (giftBtn) giftBtn.addEventListener("click", () => openModal(giftModal));

if (giftForm) {
  giftForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const giverEl = document.getElementById("giftGiver");
    const descEl  = document.getElementById("giftDescription");
    const giver   = giverEl ? giverEl.value.trim() : "";
    const desc    = descEl  ? descEl.value.trim()  : "";

    if (!giver || !desc) {
      toast("Preencha seu nome e a descrição do presente.", "error");
      return;
    }

    const list = loadList("contributions");
    list.push({ type: "gift", name: giver, description: desc, amount: "", ts: new Date().toISOString() });
    saveList("contributions", list);

    const first = giver.split(" ")[0];
    toast(`Obrigado, ${first}! Presente registrado com carinho!`, "success");

    closeModal(giftModal);
    giftForm.reset();
  });
}

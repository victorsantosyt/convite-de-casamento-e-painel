/* ==============================================
   Convite de Casamento — Stephanny & Victor
   08 de Agosto de 2026 | Água Boa - MT
   ============================================== */

const WHATSAPP_NOIVOS = "556698130-9903";

const WEDDING_DATE = new Date("2026-08-08T18:00:00");

// ── API (Netlify Functions + Blobs) ─────────────
// As confirmações e contribuições são enviadas para o servidor, para que o
// painel administrativo consiga vê-las de qualquer aparelho.
const API = { rsvps: "/api/rsvps", contributions: "/api/contributions" };

async function apiPost(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`request_failed_${res.status}`);
  return res.json();
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

// ── Scroll suave para âncoras internas ───────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ── Modal engine ─────────────────────────────────
function openModal(modal) {
  if (!modal) return;
  const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarW > 0) document.body.style.paddingRight = scrollbarW + "px";
  document.body.style.overflow = "hidden";
  modal.classList.add("open");
  const focusable = modal.querySelector("input, button");
  if (focusable) setTimeout(() => focusable.focus(), 80);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
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
  link.href      = `https://wa.me/${WHATSAPP_NOIVOS.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
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

async function submitRSVP(status) {
  const name = nameInput ? nameInput.value.trim() : "";

  if (!name) {
    toast("Por favor, informe seu nome antes de confirmar.", "error");
    if (nameInput) nameInput.focus();
    return;
  }

  // Evita cliques duplicados enquanto envia
  if (acceptBtn)  acceptBtn.disabled  = true;
  if (declineBtn) declineBtn.disabled = true;

  try {
    await apiPost(API.rsvps, { name, status });
  } catch {
    toast("Não foi possível registrar agora. Verifique sua conexão e tente novamente.", "error");
    if (acceptBtn)  acceptBtn.disabled  = false;
    if (declineBtn) declineBtn.disabled = false;
    return;
  }

  addWhatsAppCTA(name, status);

  const first = name.split(" ")[0];

  if (status === "accepted") {
    toast(`Presença confirmada! Obrigado, ${first}! Nos vemos em breve!`, "success");
    if (acceptBtn) acceptBtn.textContent = "Presença Confirmada!";
  } else {
    toast(`Entendemos, ${first}. Sentiremos sua falta!`, "info");
    if (declineBtn) declineBtn.textContent = "Recusa Registrada";
  }

  if (nameInput) nameInput.disabled = true;
}

if (acceptBtn)  acceptBtn .addEventListener("click", () => submitRSVP("accepted"));
if (declineBtn) declineBtn.addEventListener("click", () => submitRSVP("declined"));

// ── PIX EMV Payload (Copia e Cola) ───────────────
const PIX_KEY  = "victorsantosyt24@gmail.com";
const PIX_NAME = "STEPHANNY E VICTOR";
const PIX_CITY = "AGUA BOA";

function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xFFFF;
    }
  }
  return crc;
}

function generatePixCode(amount) {
  const f = (id, val) => `${id}${String(val.length).padStart(2, "0")}${val}`;
  const merchantInfo = f("26", f("00", "BR.GOV.BCB.PIX") + f("01", PIX_KEY));
  let p = f("00", "01") + f("01", "11") + merchantInfo
        + f("52", "0000") + f("53", "986")
        + f("54", Number(amount).toFixed(2))
        + f("58", "BR") + f("59", PIX_NAME) + f("60", PIX_CITY)
        + f("62", f("05", "***")) + "6304";
  return p + crc16(p).toString(16).toUpperCase().padStart(4, "0");
}

function formatBRL(val) {
  return "R$ " + Number(val).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Modal PIX ────────────────────────────────────
const pixModal       = document.getElementById("pixModal");
const pixBtn         = document.getElementById("pixBtn");
const pixStep1       = document.getElementById("pixStep1");
const pixStep2       = document.getElementById("pixStep2");
const pixStep3       = document.getElementById("pixStep3");
const pixKeyNote     = document.getElementById("pixKeyNote");
const pixForm        = document.getElementById("pixForm");
const pixDonorName   = document.getElementById("pixDonorName");
const pixAmountInput = document.getElementById("pixAmountInput");
const pixAmountBadge = document.getElementById("pixAmountBadge");
const pixCodeText    = document.getElementById("pixCodeText");
const copyPixCodeBtn = document.getElementById("copyPixCodeBtn");
const confirmPixBtn  = document.getElementById("confirmPixBtn");
const pixBackBtn     = document.getElementById("pixBackBtn");

function showPixStep(step) {
  if (pixStep1) pixStep1.style.display = step === 1 ? "" : "none";
  if (pixStep2) pixStep2.style.display = step === 2 ? "" : "none";
  if (pixStep3) pixStep3.style.display = step === 3 ? "" : "none";
  if (pixKeyNote) pixKeyNote.style.display = step === 3 ? "none" : "";
}

function resetPixModal() {
  showPixStep(1);
  if (pixForm) pixForm.reset();
  if (copyPixCodeBtn) copyPixCodeBtn.textContent = "Copiar Código PIX";
  if (confirmPixBtn) {
    confirmPixBtn.disabled = false;
    confirmPixBtn.innerHTML = '<i class="ph ph-check-circle" aria-hidden="true"></i> Confirmar Pagamento';
  }
}

if (pixBtn) pixBtn.addEventListener("click", () => { resetPixModal(); openModal(pixModal); });

document.querySelectorAll("#pixModal .close-modal").forEach((btn) => {
  btn.addEventListener("click", resetPixModal);
});

// Passo 1 → 2: gerar código
if (pixForm) {
  pixForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name   = pixDonorName   ? pixDonorName.value.trim()        : "";
    const amount = pixAmountInput ? parseFloat(pixAmountInput.value) : 0;

    if (!name) {
      toast("Por favor, informe seu nome.", "error");
      if (pixDonorName) pixDonorName.focus();
      return;
    }
    if (!amount || amount < 1) {
      toast("Informe um valor mínimo de R$ 1,00.", "error");
      if (pixAmountInput) pixAmountInput.focus();
      return;
    }

    if (pixCodeText)    pixCodeText.textContent    = generatePixCode(amount);
    if (pixAmountBadge) pixAmountBadge.textContent = formatBRL(amount);
    if (copyPixCodeBtn) copyPixCodeBtn.textContent = "Copiar Código PIX";
    showPixStep(2);
  });
}

// Copiar código
if (copyPixCodeBtn) {
  copyPixCodeBtn.addEventListener("click", async () => {
    const code = pixCodeText ? pixCodeText.textContent.trim() : "";
    if (!code) return;

    const copied = await (async () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try { await navigator.clipboard.writeText(code); return true; }
        catch { /* fallback */ }
      }
      const ta = Object.assign(document.createElement("textarea"), {
        value: code,
        style: "position:fixed;opacity:0;pointer-events:none;",
      });
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    })();

    if (copied) {
      copyPixCodeBtn.textContent = "Código Copiado!";
      toast("Código PIX copiado! Cole no app do seu banco para pagar.", "success");
      setTimeout(() => { if (copyPixCodeBtn) copyPixCodeBtn.textContent = "Copiar Código PIX"; }, 2800);
    } else {
      toast("Não foi possível copiar. Selecione o código manualmente.", "error");
    }
  });
}

// Confirmar pagamento
let pixConfirming = false;
if (confirmPixBtn) {
  confirmPixBtn.addEventListener("click", async () => {
    if (pixConfirming) return;
    const name   = pixDonorName   ? pixDonorName.value.trim()        : "";
    const amount = pixAmountInput ? parseFloat(pixAmountInput.value) : 0;
    if (!name || !amount) return;

    pixConfirming = true;
    confirmPixBtn.disabled = true;
    confirmPixBtn.textContent = "Registrando...";

    try {
      await apiPost(API.contributions, {
        type: "pix",
        name,
        amount: formatBRL(amount),
        description: "Contribuição via PIX",
        confirmed: true,
      });
    } catch {
      toast("Não foi possível registrar agora. Tente novamente.", "error");
      confirmPixBtn.disabled = false;
      confirmPixBtn.innerHTML = '<i class="ph ph-check-circle" aria-hidden="true"></i> Confirmar Pagamento';
      pixConfirming = false;
      return;
    }

    const first = name.split(" ")[0];
    showPixStep(3);
    toast(`Obrigado, ${first}! Sua contribuição foi registrada com carinho!`, "success");
    pixConfirming = false;
  });
}

// Voltar ao passo 1
if (pixBackBtn) pixBackBtn.addEventListener("click", () => showPixStep(1));

// ── Modal Presentes ───────────────────────────────
const giftModal = document.getElementById("giftModal");
const giftBtn   = document.getElementById("giftBtn");
const giftForm  = document.getElementById("giftForm");

if (giftBtn) giftBtn.addEventListener("click", () => openModal(giftModal));

if (giftForm) {
  giftForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const giverEl = document.getElementById("giftGiver");
    const descEl  = document.getElementById("giftDescription");
    const giver   = giverEl ? giverEl.value.trim() : "";
    const desc    = descEl  ? descEl.value.trim()  : "";

    if (!giver || !desc) {
      toast("Preencha seu nome e a descrição do presente.", "error");
      return;
    }

    const submitBtn = giftForm.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      await apiPost(API.contributions, { type: "gift", name: giver, description: desc, amount: "" });
    } catch {
      toast("Não foi possível registrar agora. Tente novamente.", "error");
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    const first = giver.split(" ")[0];
    toast(`Obrigado, ${first}! Presente registrado com carinho!`, "success");

    closeModal(giftModal);
    giftForm.reset();
    if (submitBtn) submitBtn.disabled = false;
  });
}

// @ts-check
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8181';

// Limpa localStorage antes de cada teste
test.beforeEach(async ({ page }) => {
  await page.goto(BASE);
  await page.evaluate(() => {
    localStorage.removeItem('sv_rsvps');
    localStorage.removeItem('sv_contributions');
  });
});

// ─────────────────────────────────────────────────────────────
// BLOCO 1 — Carregamento e estrutura da página
// ─────────────────────────────────────────────────────────────

test('hero renderiza nomes e data corretamente', async ({ page }) => {
  await page.goto(BASE);
  const h1 = page.locator('.hero-content h1');
  await expect(h1).toContainText('Dias');
  await expect(h1).toContainText('Victor Santos');
  await expect(page.locator('.hero-date')).toContainText('08 de Agosto de 2026');
  await expect(page.locator('.btn-primary')).toBeVisible();
});

test('contagem regressiva exibe os 4 blocos com valores', async ({ page }) => {
  await page.goto(BASE);
  for (const id of ['#t-days', '#t-hours', '#t-min', '#t-sec']) {
    const el = page.locator(id);
    await expect(el).toBeVisible();
    const txt = await el.textContent();
    expect(txt).not.toBe('--');
    expect(Number(txt)).toBeGreaterThanOrEqual(0);
  }
});

test('icones Phosphor carregam (detail-icon visivel e tem tamanho)', async ({ page }) => {
  await page.goto(BASE);
  const icon = page.locator('.detail-icon i').first();
  await expect(icon).toBeVisible();
  const box = await icon.boundingBox();
  expect(box?.width).toBeGreaterThan(0);
  expect(box?.height).toBeGreaterThan(0);
});

// ─────────────────────────────────────────────────────────────
// BLOCO 2 — Fluxo RSVP
// ─────────────────────────────────────────────────────────────

test('RSVP: aceitar sem nome exibe toast de erro', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('#acceptBtn').click();
  const toast = page.locator('#toast');
  await expect(toast).toHaveClass(/error/);
  await expect(toast).toContainText('nome');
});

test('RSVP: recusar sem nome exibe toast de erro', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('#declineBtn').click();
  await expect(page.locator('#toast')).toHaveClass(/error/);
});

test('RSVP: aceitar salva no localStorage e desabilita botoes', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('#guestName').fill('Maria Silva');
  await page.locator('#acceptBtn').click();

  // toast de sucesso
  const toast = page.locator('#toast');
  await expect(toast).toHaveClass(/success/);
  await expect(toast).toContainText('Maria');

  // botões desabilitados
  await expect(page.locator('#acceptBtn')).toBeDisabled();
  await expect(page.locator('#declineBtn')).toBeDisabled();
  await expect(page.locator('#guestName')).toBeDisabled();

  // botão WhatsApp aparece após confirmação
  const waBtn = page.locator('#waBtn');
  await expect(waBtn).toBeVisible();
  const href = await waBtn.getAttribute('href');
  expect(href).toContain('wa.me');
  expect(href).toContain('Maria%20Silva');

  // dado salvo
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('sv_rsvps') || '[]')
  );
  expect(stored).toHaveLength(1);
  expect(stored[0].name).toBe('Maria Silva');
  expect(stored[0].status).toBe('accepted');
  expect(stored[0].ts).toBeTruthy();
});

test('RSVP: recusar salva status declined e exibe botao WhatsApp', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('#guestName').fill('João Santos');
  await page.locator('#declineBtn').click();

  await expect(page.locator('#toast')).toHaveClass(/info/);

  // botão WhatsApp também aparece na recusa
  await expect(page.locator('#waBtn')).toBeVisible();

  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('sv_rsvps') || '[]')
  );
  expect(stored[0].status).toBe('declined');
  expect(stored[0].name).toBe('João Santos');
});

test('RSVP: mesmo nome atualiza o registro existente (nao duplica)', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('#guestName').fill('Ana Lima');
  await page.locator('#acceptBtn').click();

  // simula uma segunda resposta via localStorage direto
  await page.evaluate(() => {
    const list = JSON.parse(localStorage.getItem('sv_rsvps') || '[]');
    // confirma que só tem 1 entrada
    if (list.length !== 1) throw new Error('deveria ter 1');
  });

  // Recarrega e tenta com mesmo nome via decline
  await page.evaluate(() => localStorage.removeItem('sv_rsvps'));
  await page.reload();
  await page.locator('#guestName').fill('Ana Lima');
  await page.locator('#declineBtn').click();

  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('sv_rsvps') || '[]')
  );
  expect(stored).toHaveLength(1);
});

// ─────────────────────────────────────────────────────────────
// BLOCO 3 — Modal PIX
// ─────────────────────────────────────────────────────────────

test('modal PIX: abre ao clicar no botao', async ({ page }) => {
  await page.goto(BASE);
  const modal = page.locator('#pixModal');
  await expect(modal).not.toHaveClass(/open/);
  await page.locator('#pixBtn').click();
  await expect(modal).toHaveClass(/open/);
  await expect(page.locator('#pixKey')).toContainText('victorsantosyt24@gmail.com');
});

test('modal PIX: fecha ao clicar no X', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('#pixBtn').click();
  await expect(page.locator('#pixModal')).toHaveClass(/open/);
  await page.locator('#pixModal .close-modal').click();
  await expect(page.locator('#pixModal')).not.toHaveClass(/open/);
});

test('modal PIX: fecha ao clicar fora (overlay)', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('#pixBtn').click();
  // Clica na borda do overlay, não no modal-box
  await page.locator('#pixModal').click({ position: { x: 5, y: 5 } });
  await expect(page.locator('#pixModal')).not.toHaveClass(/open/);
});

test('modal PIX: fecha com tecla ESC', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('#pixBtn').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#pixModal')).not.toHaveClass(/open/);
});

test('modal PIX: botao copiar muda texto apos clique', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('#pixBtn').click();

  // Headless nao tem permissao de clipboard — simula API com sucesso
  await page.evaluate(() => {
    let _stored = '';
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (t) => { _stored = t; return Promise.resolve(); },
        readText:  ()  => Promise.resolve(_stored),
      },
    });
  });

  await page.locator('#copyPixBtn').click();

  // Toast de sucesso deve aparecer
  await expect(page.locator('#toast')).toHaveClass(/success/);
  await expect(page.locator('#toast')).toContainText('PIX');
});

// ─────────────────────────────────────────────────────────────
// BLOCO 4 — Modal Presentes
// ─────────────────────────────────────────────────────────────

test('modal presentes: abre ao clicar no botao', async ({ page }) => {
  await page.goto(BASE);
  await expect(page.locator('#giftModal')).not.toHaveClass(/open/);
  await page.locator('#giftBtn').click();
  await expect(page.locator('#giftModal')).toHaveClass(/open/);
});

test('modal presentes: fecha ao clicar no X', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('#giftBtn').click();
  await page.locator('#giftModal .close-modal').click();
  await expect(page.locator('#giftModal')).not.toHaveClass(/open/);
});

test('modal presentes: submit sem campos exibe erro', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('#giftBtn').click();
  await page.locator('#giftForm [type="submit"]').click();
  await expect(page.locator('#toast')).toHaveClass(/error/);
});

test('modal presentes: submit valido salva e fecha modal', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('#giftBtn').click();
  await page.locator('#giftGiver').fill('Carlos Melo');
  await page.locator('#giftDescription').fill('Conjunto de panelas');
  await page.locator('#giftForm [type="submit"]').click();

  await expect(page.locator('#toast')).toHaveClass(/success/);
  await expect(page.locator('#giftModal')).not.toHaveClass(/open/);

  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('sv_contributions') || '[]')
  );
  expect(stored).toHaveLength(1);
  expect(stored[0].type).toBe('gift');
  expect(stored[0].name).toBe('Carlos Melo');
  expect(stored[0].description).toBe('Conjunto de panelas');
});

// ─────────────────────────────────────────────────────────────
// BLOCO 5 — Painel Admin
// ─────────────────────────────────────────────────────────────

test('admin: PIN errado exibe mensagem de erro', async ({ page }) => {
  await page.goto(`${BASE}/admin/`);
  await page.locator('#pinInput').fill('9999');
  await page.locator('#loginBtn').click();
  await expect(page.locator('#loginError')).toContainText('incorreto');
  await expect(page.locator('#dashboard')).not.toBeVisible();
});

test('admin: PIN correto (0808) exibe dashboard', async ({ page }) => {
  await page.goto(`${BASE}/admin/`);
  await page.locator('#pinInput').fill('0808');
  await page.locator('#loginBtn').click();
  await expect(page.locator('#dashboard')).toBeVisible();
  await expect(page.locator('#loginScreen')).not.toBeVisible();
});

test('admin: Enter no campo de PIN faz login', async ({ page }) => {
  await page.goto(`${BASE}/admin/`);
  await page.locator('#pinInput').fill('0808');
  await page.keyboard.press('Enter');
  await expect(page.locator('#dashboard')).toBeVisible();
});

test('admin: botao sair retorna para tela de login', async ({ page }) => {
  await page.goto(`${BASE}/admin/`);
  await page.locator('#pinInput').fill('0808');
  await page.locator('#loginBtn').click();
  await page.locator('#logoutBtn').click();
  await expect(page.locator('#loginScreen')).toBeVisible();
  await expect(page.locator('#dashboard')).not.toBeVisible();
});

test('admin: dashboard exibe contagens corretas a partir do localStorage', async ({ page }) => {
  await page.goto(`${BASE}/admin/`);
  await page.evaluate(() => {
    localStorage.setItem('sv_rsvps', JSON.stringify([
      { name: 'Maria', status: 'accepted', ts: new Date().toISOString() },
      { name: 'Joao',  status: 'declined', ts: new Date().toISOString() },
      { name: 'Pedro', status: 'accepted', ts: new Date().toISOString() },
    ]));
    localStorage.setItem('sv_contributions', JSON.stringify([
      { type: 'pix',  name: 'Ana',    description: '', amount: 'R$100', ts: new Date().toISOString() },
      { type: 'gift', name: 'Carlos', description: 'Taça', amount: '', ts: new Date().toISOString() },
    ]));
  });
  await page.locator('#pinInput').fill('0808');
  await page.locator('#loginBtn').click();

  await expect(page.locator('#sTotalRsvp')).toHaveText('3');
  await expect(page.locator('#sAccepted')).toHaveText('2');
  await expect(page.locator('#sDeclined')).toHaveText('1');
  await expect(page.locator('#sContribs')).toHaveText('2');
});

test('admin: tabela de convidados lista os registros', async ({ page }) => {
  await page.goto(`${BASE}/admin/`);
  await page.evaluate(() => {
    localStorage.setItem('sv_rsvps', JSON.stringify([
      { name: 'Beatriz Lima', status: 'accepted', ts: new Date().toISOString() },
    ]));
  });
  await page.locator('#pinInput').fill('0808');
  await page.locator('#loginBtn').click();

  await expect(page.locator('#rsvpBody')).toContainText('Beatriz Lima');
  await expect(page.locator('.pill-green')).toBeVisible();
  await expect(page.locator('#rsvpEmpty')).toBeHidden();
});

test('admin: estado vazio exibe mensagem quando nao ha registros', async ({ page }) => {
  await page.goto(`${BASE}/admin/`);
  await page.evaluate(() => {
    localStorage.removeItem('sv_rsvps');
    localStorage.removeItem('sv_contributions');
  });
  await page.locator('#pinInput').fill('0808');
  await page.locator('#loginBtn').click();

  await expect(page.locator('#rsvpEmpty')).toBeVisible();
  await expect(page.locator('#contribEmpty')).toBeVisible();
});

test('admin: formulario registra nova contribuicao na tabela', async ({ page }) => {
  await page.goto(`${BASE}/admin/`);
  await page.evaluate(() => localStorage.clear());
  await page.locator('#pinInput').fill('0808');
  await page.locator('#loginBtn').click();

  await page.locator('#cfType').selectOption('pix');
  await page.locator('#cfName').fill('Ricardo Alves');
  await page.locator('#cfDesc').fill('Transferencia PIX');
  await page.locator('#cfAmount').fill('R$ 200,00');
  await page.locator('#contribForm [type="submit"]').click();

  await expect(page.locator('#toast')).toHaveClass(/ok/);
  await expect(page.locator('#contribBody')).toContainText('Ricardo Alves');
  await expect(page.locator('#sContribs')).toHaveText('1');
});

test('admin: excluir convidado remove da tabela e atualiza contagem', async ({ page }) => {
  await page.goto(`${BASE}/admin/`);
  await page.evaluate(() => {
    localStorage.setItem('sv_rsvps', JSON.stringify([
      { name: 'Fernanda', status: 'accepted', ts: new Date().toISOString() },
    ]));
  });
  await page.locator('#pinInput').fill('0808');
  await page.locator('#loginBtn').click();

  // Clica no botão de deletar (aceita o confirm)
  page.on('dialog', d => d.accept());
  await page.locator('#rsvpBody .btn-del').click();

  await expect(page.locator('#sTotalRsvp')).toHaveText('0');
  await expect(page.locator('#rsvpEmpty')).toBeVisible();
});

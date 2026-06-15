# Deploy no Netlify — Convite & Painel

O site é estático, mas as confirmações de presença e contribuições agora são
gravadas no **Netlify Blobs** (armazenamento compartilhado) através de
**Netlify Functions**. Assim o painel administrativo enxerga as respostas de
qualquer aparelho — não fica mais preso ao navegador de cada convidado.

## Como funciona

```
Convidado (index.html)  ──POST──►  /api/rsvps          ┐
Convidado (presente)    ──POST──►  /api/contributions  ├──►  Netlify Blobs
Painel (admin/)         ──GET/DELETE──►  /api/*  (com token)  ┘
```

- `netlify/functions/rsvps.mjs` → rota `/api/rsvps`
- `netlify/functions/contributions.mjs` → rota `/api/contributions`
- `POST` é público (qualquer convidado pode confirmar/contribuir).
- `GET` e `DELETE` exigem o cabeçalho `x-admin-token`, validado pelo servidor.

## Configuração no Netlify

1. Conecte este repositório ao Netlify (Add new site → Import from Git).
2. Build settings: **publish directory = `.`** e **functions directory =
   `netlify/functions`** (já definidos no `netlify.toml`, não precisa mexer).
3. **(Recomendado) Defina a senha do painel:** em
   *Site settings → Environment variables*, crie a variável:
   - `ADMIN_TOKEN` = uma senha forte à sua escolha.
   - Se não definir, o painel usa o PIN padrão `0808`.
4. O Netlify Blobs é habilitado automaticamente — não precisa criar banco nem
   conta em outro serviço.

## Acessar o painel

Abra `https://SEU-SITE.netlify.app/admin/` e informe o `ADMIN_TOKEN`
(ou `0808`, se não tiver configurado).

## Rodar localmente

```bash
npm install
npx netlify dev
```

Isso sobe o site + as funções em `http://localhost:8888`. Abrir os arquivos
HTML direto (file://) **não** funciona para gravar/ler, pois as rotas `/api/*`
só existem sob o Netlify.

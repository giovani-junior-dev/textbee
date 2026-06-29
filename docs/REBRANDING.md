# Rebranding: textbee → Wablast SMS

Registro do rebrand completo desta fase (branch `feat/i18n-rebranding-wablast`, PR #2 em
`giovani-junior-dev/textbee`): troca de marca **textbee → Wablast SMS**, tema de cores
**teal**, nova marca/logo "sms" (balão), e repontamento dos links seguros para
`sms.wablastmessage.com`. Cobre **web** (`web/`) e **Android** (`android/`).

> Identidade e princípios de marca vivem em [`../PRODUCT.md`](../PRODUCT.md);
> o design system (tokens, componentes, do's & don'ts) em [`../DESIGN.md`](../DESIGN.md)
> e [`../.impeccable/design.json`](../.impeccable/design.json). Detalhes do Android
> ficam em [ANDROID.md](./ANDROID.md); i18n em [I18N.md](./I18N.md).

---

## 1. Identidade

- **Nome do produto:** Wablast SMS.
- **North Star:** "The Quiet Console" — superfície autenticada, densa em dados; a ferramenta some dentro da tarefa.
- **Cor de marca:** teal sóbrio (`#006149` claro / `#1EB88A` escuro). **Não** o verde "WhatsApp" saturado.
- **Marca/logo:** balão de fala com "sms" (círculo branco + sms preto).
- **Site público da marca:** `https://sms.wablastmessage.com`.

---

## 2. Rebrand visual — web (`web/`)

### Tema de cores (teal)
- `styles/main.css`: `--primary` = `165 100% 19%` (claro) / `162 72% 42%` (escuro).
- Correção `--brand-foreground` = **branco** no dark (texto de botão primário estava ilegível).
- `tailwind.config.js`: a paleta `brand.*` foi trocada de **âmbar/laranja → rampa teal**
  (corrigia nav ativo/ícones que apareciam laranja, sobra do rebrand original do textbee).
- Tokens `--sidebar-*` adicionados (CSS + tailwind) para a nova sidebar.

> **Regra The No-Amber:** nenhum âmbar/laranja (`#D97706`, `#B45309`) deve sobrar. Ver [DESIGN.md](../DESIGN.md).

### Sidebar (componente assinatura)
Redesenhada com o primitivo shadcn:
- Novos arquivos: `components/ui/sidebar.tsx`, `hooks/use-mobile.tsx`, `components/ui/separator.tsx`.
- Altura total, `SidebarHeader` com logo, grupo "Menu", `SidebarFooter` com usuário.
- Colapsável: rail de ícones, atalho ⌘B/Ctrl+B, estado persistido em cookie.
- Mobile: vira `Sheet` (overlay).
- **Removidos:** o antigo rail flutuante (`fixed top-[20%] w-24`) e a bottom-nav mobile.

### Marca, logo e chrome
- Marca duplicada removida do topbar — fica só na sidebar.
- Logo na sidebar **sem caixa branca**, com `dark:invert`.
- Logo + favicon trocados pela marca "sms": `public/images/logo.png`, `app/icon.png`, `favicon.ico`.
- **Footer** e **widget de chat** (`SupportHQWidget`) removidos da área autenticada
  (`app/(app)/layout.tsx`). O footer do **site público** permanece.

### Docs de design criados nesta fase
`PRODUCT.md` (register `product`, North Star, anti-refs) · `DESIGN.md` (formato Stitch, tokens teal, componentes, do/don't) · `.impeccable/design.json`.

---

## 3. Rebrand — app Android (`android/`)

Resumo aqui; detalhes e build em [ANDROID.md](./ANDROID.md).

- **UI shipada = Compose** (Splash → onboarding/dashboard/settings/messages). A UI XML (`MainActivity`) é legada.
- **Nome do app → "Wablast SMS"** (`build.gradle`, flavors `dev` e `prod`).
- **Tema teal:** themes XML (day+night) e Compose `ui/theme/Color.kt` (laranja → teal `#006149` claro / `#1EB88A`–`#0E9268` escuro).
- **Ícones:** launcher (adaptive + legacy + round, todas densidades) + logo interno `ic_app_logo.webp` → marca "sms".
- **PT-BR:** UI XML (56 strings) + Compose (202 strings em 14 arquivos) + toasts Java/Kotlin (21). App pensado só para PT-BR (Brasil).
- **Ajustes de UI:** Configurações enxugado (removidas seções Comunidade, Jurídico, UI e "Verificar atualizações"); Dashboard sem "Ações rápidas"; About sem GitHub e com site → `https://sms.wablastmessage.com`.

---

## 4. Internacionalização (resumo)

Painel `web/` bilíngue com **next-intl** (App Router, cookie `NEXT_LOCALE`, sem prefixo de URL).
**PT-BR padrão + EN no toggle.** Todas as telas vivas migradas; paridade **742/742** chaves, `tsc` limpo.
Documentação completa em [I18N.md](./I18N.md).

**Não migrado (intencional):** dead code `account-settings.tsx`/`main-dashboard.tsx`,
`sr-only "Close"` de primitivos shadcn, mensagens de erro da API NestJS (inglês).

---

## 5. Varredura de links e pendências (SCR-411)

### Feito nesta fase
- **Web:** links 🟢 **seguros** (rotas de marketing/legal, share, marca) → `sms.wablastmessage.com`.
- **Android:** links/textos **user-facing** com "textbee" → `sms.wablastmessage.com`.
  Mantidos de propósito: API de dev `api.dev.textbee.dev`, identificadores internos e o package.

### Pendente — Linear **SCR-411** (time Script7 Sistemas)
Repontar os links textbee **🟡 restantes quando a infra VPS estiver online**:
- `statusPage`
- `api-guide` (exemplos + docs)
- `external-links` (github / polar / twitter / linkedin)
- página de `download` (GitHub releases)

**NÃO mexer** (intencional): `httpServerClient` host do Docker, `.env` do DB, API de dev,
identificadores internos e o package do app.

### App mobile
Experimental — nada além do já feito nesta fase.
</content>

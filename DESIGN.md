---
name: Wablast SMS
description: Painel self-hosted de gateway de SMS — console calmo, teal, bilíngue PT-BR/EN.
colors:
  primary: "#006149"
  primary-dark: "#1EB88A"
  brand-600: "#006B4F"
  brand-500: "#0E9268"
  brand-100: "#C3EDDF"
  foreground: "#0A0E1A"
  muted-foreground: "#6B7280"
  background: "#FFFFFF"
  surface-dark: "#262626"
  border: "#E5E7EB"
  destructive: "#EF4444"
  sidebar-bg: "#FAFEFD"
  sidebar-accent: "#DDF5EC"
  sidebar-accent-foreground: "#00422F"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.01em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    height: "2.25rem"
  button-primary-hover:
    backgroundColor: "{colors.brand-600}"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "1rem"
  sidebar-menu-button-active:
    backgroundColor: "{colors.sidebar-accent}"
    textColor: "{colors.sidebar-accent-foreground}"
    rounded: "{rounded.md}"
    height: "2rem"
  badge-active:
    backgroundColor: "{colors.brand-100}"
    textColor: "{colors.brand-600}"
    rounded: "{rounded.sm}"
---

# Design System: Wablast SMS

## 1. Overview

**Creative North Star: "The Quiet Console"**

Wablast SMS é uma sala de controle, não um panfleto. O usuário entra para uma tarefa operacional, registrar um aparelho, disparar um lote de SMS, conferir por que um webhook falhou, e a interface tem que sumir dentro dessa tarefa. A medida de qualidade não é "alguém diria que IA fez": familiaridade aqui é virtude. A medida é se alguém fluente em Linear, Stripe e shadcn/ui senta e confia de imediato, ou trava em cada componente sutilmente errado.

O sistema é construído sobre tokens shadcn/ui (HSL em CSS custom properties, claro e escuro) com um único acento de marca: **teal Wablast**. Tudo o mais é neutro. A densidade é alta onde precisa (tabelas de dispositivos, histórico de mensagens, chaves de API truncadas em mono), e calma onde não precisa. Bilíngue de primeira classe (PT-BR padrão, EN no toggle) via next-intl, com paridade total de chaves.

O que este sistema **rejeita**: o verde neon estilo WhatsApp saturado, qualquer sobra do rebrand âmbar/laranja antigo, o template hero-metric de landing SaaS dentro do painel, glassmorphism decorativo, e a antiga sidebar flutuante destacada. Navegação é estrutural e de altura total, no estilo shadcn.

**Key Characteristics:**
- Console calmo: neutro por padrão, teal só para ação/seleção/estado.
- Densidade controlada: tabelas e painéis densos, respiro nos títulos.
- Estado sempre visível: vocabulário semântico padronizado (ativo, habilitado, entregue, falhou, pendente).
- Bilíngue PT-BR/EN sem string órfã.
- Tema claro e escuro, ambos com teal legível.

## 2. Colors

Paleta restrita: neutros tonais + um único acento teal. Cor é ação e estado, nunca decoração.

### Primary
- **Teal Wablast Profundo** (`#006149`, light / `hsl(165 100% 19%)`): cor de marca e de ação primária. Fundo de botões primários, links, foco (ring), seleção atual na sidebar, indicadores de estado positivo. No escuro vira **Teal Sinal** (`#1EB88A` / `hsl(162 72% 42%)`), mais claro para contraste em fundo escuro.
- **Rampa `brand.*`** (teal, `#E6F7F1` → `#02211A`, âncora `brand-600 #006B4F`): tons de marca para badges, ícones de estado, realces sutis (`brand-100` como fundo suave, `brand-600` como texto/borda de acento). Substituiu a antiga rampa âmbar.

### Neutral
- **Quase-preto Navy** (`#0A0E1A` / `hsl(224 71.4% 4.1%)`): texto principal no claro.
- **Cinza Médio** (`#6B7280` / `hsl(220 8.9% 46.1%)`): texto secundário, labels, metadados.
- **Branco** (`#FFFFFF`): superfície de conteúdo e cards no claro. **Cinza Carvão** (`#262626` / `hsl(0 0% 15%)`): superfície no escuro.
- **Borda Névoa** (`#E5E7EB` / `hsl(220 13% 91%)`): bordas, divisores, contorno de inputs.

### Sidebar (segunda camada neutra)
- **Branco-Teal** (`#FAFEFD` / `hsl(168 30% 98.5%)`): fundo da sidebar no claro, levemente mais frio que o conteúdo. No escuro `hsl(0 0% 12%)`, levemente mais escuro que o conteúdo.
- **Teal Suave** (`#DDF5EC` / `hsl(165 44% 93%)`): fundo do item de menu ativo/hover; texto `#00422F`.

### Semantic
- **Vermelho Destrutivo** (`#EF4444` / `hsl(0 84.2% 60.2%)`): apenas ações destrutivas (excluir, revogar) e erros.

### Named Rules
**The One Teal Rule.** O teal é o único acento. Aparece em ação primária, seleção/estado ativo e foco, nunca como enfeite. Se uma tela tem teal em mais de ~15% da área, recue para neutro.
**The No-Amber Rule.** Nenhum âmbar/laranja. A rampa `brand.*` é teal. Qualquer `#D97706`/`#B45309` remanescente é bug do rebrand.

## 3. Typography

**Display/Body/Label/Mono Font:** Inter com fallback de fonte de sistema (`-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`). Mono para dados técnicos: `ui-monospace, SFMono-Regular, Menlo, monospace`.

**Character:** Uma única família sans carrega títulos, labels, corpo e botões. Sem par display/serifa, isto é produto, não capa de revista. Mono entra só para o que é literalmente código/identificador (chaves de API, device IDs, signing secret, payloads).

### Hierarchy
- **Display** (700, 1.875rem/`text-3xl`, line-height 1.15, tracking -0.02em): título de página (h1/h2 de seção topo).
- **Title** (600, 1.25rem/`text-xl`, line-height 1.3): títulos de card e seção.
- **Body** (400, 0.875rem/`text-sm`, line-height 1.5): texto padrão da UI. Prosa longa em 65–75ch; dados tabulares podem correr mais densos.
- **Label** (500, 0.75rem/`text-xs`, tracking 0.01em): labels de campo, metadados, badges, navegação.
- **Mono** (400, 0.8125rem): chaves, IDs, secrets, payloads JSON.

### Named Rules
**The Mono-for-Machines Rule.** Fonte mono é exclusiva de valores gerados por máquina (chaves, IDs, secrets, payloads). Nunca mono em label ou prosa.

## 4. Elevation

Sistema majoritariamente plano com sombras leves e funcionais. Profundidade vem de camadas tonais (sidebar mais fria/escura que o conteúdo, cards sobre o fundo) e de bordas de 1px, não de sombras pesadas. Sombras aparecem em superfícies flutuantes (sidebar fixa, popover, dialog, dropdown) e como reforço sutil em cards.

### Shadow Vocabulary
- **shadow-sm** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): cards, botões em repouso.
- **shadow** (`0 1px 3px 0 rgb(0 0 0 / 0.1)`): botão primário, elevação leve.
- **shadow-lg** (`0 10px 15px -3px rgb(0 0 0 / 0.1)`): sidebar fixa, dialogs, sheets.

### Named Rules
**The Flat-By-Default Rule.** Superfícies são planas em repouso. Sombra forte só em elementos genuinamente flutuantes (sidebar, popover, modal). Card não precisa de sombra grande; 1px de borda + `shadow-sm` basta.

## 5. Components

### Buttons
- **Shape:** cantos suaves de 6px (`rounded-md` = `calc(var(--radius) - 2px)`), `--radius` base 0.5rem.
- **Primary:** fundo teal (`--primary`), **texto branco** (`--brand-foreground` = branco em ambos os temas), `shadow`, altura 2.25rem (`h-9`), padding `0.5rem 1rem`. Hover: `bg-primary/90`.
- **Outline:** borda `--input`, fundo `--background`, hover `bg-accent`. Ações secundárias.
- **Destructive:** fundo vermelho, texto branco. Excluir/revogar.
- **Ghost:** sem fundo; hover `bg-accent`. Ações terciárias e ícones.
- **Hover/Focus:** transição só de cor (`transition-colors`); foco `ring-1 ring-ring` (teal).

### Badges (status chips)
- **Style:** pílula pequena, `rounded-sm`, `text-xs`. Estado positivo/ativo usa `brand-100` de fundo + `brand-600` de texto; estados semânticos (entregue/verde, falhou/vermelho, pendente/amarelo) seguem o par claro/escuro do status.
- **Uso:** todo objeto operacional (dispositivo Enabled, chave Active, webhook ACTIVE, status de SMS) ganha badge.

### Cards / Containers
- **Corner:** `rounded-lg` (8px).
- **Background:** `--card` (branco/carvão).
- **Shadow:** `shadow-sm`; borda 1px `--border`.
- **Padding interno:** 1rem (`p-4`); seções maiores 1.5rem.
- **Regra:** nada de card aninhado em card. Nada de stripe colorido na borda lateral.

### Inputs / Fields
- **Style:** borda `--input` 1px, fundo `--background`, `rounded-md`, `h-9`.
- **Focus:** `ring-1 ring-ring` teal, sem glow.
- **Disabled:** opacidade reduzida, cursor not-allowed.
- **Validação:** mensagens via i18n (zod dentro do componente); erro em `text-destructive`.

### Navigation (Sidebar) — componente assinatura
Sidebar shadcn/ui de altura total à esquerda, abaixo do topbar global.
- **Estrutura:** `SidebarHeader` (logo Wablast) · `SidebarContent` com grupo "Menu" (Dashboard, Mensagens, Comunidade, Conta) · `SidebarFooter` (avatar + nome do usuário → Conta).
- **Item:** `SidebarMenuButton` full-width, `rounded-md`, ícone 16px stroke 1.5 + label. Ativo: fundo `sidebar-accent` (teal suave) + texto `sidebar-accent-foreground` + peso medium. Hover: mesmo accent.
- **Colapso:** `collapsible="icon"` vira rail de 3rem só com ícones; tooltip mostra o label. Toggle por `SidebarTrigger` ou `SidebarRail` (borda arrastável) e atalho ⌘B/Ctrl+B; estado persiste em cookie.
- **Mobile:** vira `Sheet` (overlay) aberto pelo trigger. A antiga bottom-nav e a sidebar flutuante foram removidas.
- **Tokens:** usa exclusivamente a família `--sidebar-*` (background, foreground, accent, accent-foreground, border, ring), uma segunda camada neutra distinta do conteúdo.

### Top bar (global)
`AppHeader` sticky no topo: logo + `LanguageSwitcher` (PT-BR/EN) + `ThemeToggle` (claro/escuro/sistema) + botão Contribute + menu do usuário (avatar/logout). Permanece acima da sidebar.

## 6. Do's and Don'ts

### Do:
- **Do** usar teal (`--primary`) só para ação primária, seleção/estado ativo e foco. The One Teal Rule.
- **Do** dar texto **branco** a botões primários e destrutivos em ambos os temas (`--brand-foreground` = branco).
- **Do** usar a rampa `brand.*` teal para badges e realces de estado.
- **Do** usar a família de tokens `--sidebar-*` para qualquer chrome de navegação; mantenha a sidebar distinta do conteúdo.
- **Do** dar badge de status a todo objeto operacional, com o mesmo vocabulário semântico em todas as telas.
- **Do** usar mono só para chaves, IDs, secrets e payloads.
- **Do** manter paridade PT-BR/EN: nenhuma string solta em inglês numa tela PT.

### Don't:
- **Don't** usar verde neon / "WhatsApp saturado" como marca. Wablast é teal sóbrio.
- **Don't** deixar qualquer âmbar/laranja (`#D97706`, `#B45309`) sobrar do rebrand. The No-Amber Rule.
- **Don't** reintroduzir a sidebar flutuante destacada (`fixed top-[20%] w-24`) nem a bottom-nav mobile; navegação é a sidebar shadcn.
- **Don't** usar o template hero-metric de SaaS (número gigante + gradiente + selo) dentro do painel.
- **Don't** usar `border-left`/`border-right` > 1px como stripe de acento em card, alerta ou item de lista.
- **Don't** usar `background-clip: text` com gradiente (texto em gradiente) nem glassmorphism decorativo.
- **Don't** aninhar card dentro de card.
- **Don't** usar em dash (—) em copy de produto.

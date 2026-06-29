# Documentação — Wablast SMS (fork)

Índice da documentação do projeto. Fork de **textbee** renomeado para **Wablast SMS**,
com i18n PT-BR/EN, rebrand visual teal e app Android em PT-BR. Tudo nesta fase está na
branch `feat/i18n-rebranding-wablast` (PR #2 em `giovani-junior-dev/textbee`).

## Mapa dos documentos

| Documento | O que cobre |
|---|---|
| [REBRANDING.md](./REBRANDING.md) | Visão geral do rebrand textbee → Wablast SMS (web + Android), tema teal, marca/logo, varredura de links e pendências (SCR-411). |
| [I18N.md](./I18N.md) | Internacionalização do painel `web/` com next-intl (PT-BR padrão + EN no toggle), arquitetura, como adicionar strings, QA de paridade (742/742). |
| [ANDROID.md](./ANDROID.md) | App Android (UI Compose) — rebrand teal, PT-BR, ícones, ajustes de UI e instruções de build (workaround Windows/`HOME`). |
| [SELF_HOSTING_LOCAL_PTBR.md](./SELF_HOSTING_LOCAL_PTBR.md) | Guia completo de self-hosting local (Windows + Docker): API, web, MongoDB, Firebase, build do APK, gotchas e bugs corrigidos. |
| [API_REFERENCE.md](./API_REFERENCE.md) | Referência da API REST (endpoints de gateway, autenticação por API key). |

## Docs de design (na raiz do repo)

Vivem na raiz por convenção das ferramentas de design (`impeccable`/Stitch); referenciados aqui:

| Arquivo | O que cobre |
|---|---|
| [`../PRODUCT.md`](../PRODUCT.md) | Register `product`, North Star "The Quiet Console", usuários, personalidade de marca, anti-referências, princípios estratégicos. |
| [`../DESIGN.md`](../DESIGN.md) | Design system Wablast (formato Stitch): tokens teal, tipografia, componentes (sidebar shadcn), do's & don'ts. |
| [`../.impeccable/design.json`](../.impeccable/design.json) | Tokens de design em JSON (cores, tipografia, raios, espaçamentos, componentes). |

## Estado atual desta fase

- **i18n web:** completo. 742/742 chaves PT-BR/EN, `tsc` limpo. Ver [I18N.md](./I18N.md).
- **Rebrand web:** completo. Tema teal, sidebar shadcn, logo/favicon "sms", footer/chat removidos da área autenticada. Ver [REBRANDING.md](./REBRANDING.md).
- **App Android:** completo (UI Compose shipada). Nome "Wablast SMS", tema teal, ícone novo, PT-BR. Ver [ANDROID.md](./ANDROID.md).
- **Links textbee:** os 🟢 seguros foram repontados para `sms.wablastmessage.com`; os 🟡 restantes aguardam a infra VPS (Linear **SCR-411**). Ver [REBRANDING.md](./REBRANDING.md#5-varredura-de-links-e-pendências-scr-411).
</content>
</invoke>

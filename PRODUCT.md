# Product: Wablast SMS

> Painel self-hosted de gateway de SMS. Transforma aparelhos Android em gateways de envio/recebimento de SMS via API, webhooks e dashboard web.

## Register

**product** — o design SERVE a tarefa. Superfície autenticada, densa em dados (dispositivos, chaves de API, histórico de mensagens, webhooks, billing). A ferramenta deve desaparecer dentro da tarefa.

## Users

- **Devs e pequenas equipes** integrando SMS em produtos próprios sem depender de um SaaS de SMS pago: usam API key + webhooks.
- **Donos de produto/negócio** (ex.: o operador do Wablast) que rodam a própria infra (Android + servidor) e gerenciam dispositivos, limites e entregas pelo painel.
- Bilíngue **PT-BR (padrão) + EN** via toggle. Usuário típico: brasileiro, técnico, lendo em PT mas confortável com termos em inglês (API key, webhook, payload).

## Product purpose

Dar controle operacional sobre uma frota de aparelhos Android usados como gateway de SMS: registrar dispositivos, gerar/revogar chaves, enviar SMS (individual e em massa via CSV), acompanhar histórico e status de entrega, configurar webhooks bidirecionais e monitorar uso/limites de plano. Valor central: **confiabilidade observável** — o usuário precisa confiar que a mensagem saiu, chegou e que o webhook disparou.

## Brand personality

- **Teal Wablast** (`#006149` claro / `#1EB88A` escuro) como cor de confiança e sinal. Verde-azulado sóbrio, não o verde "WhatsApp" saturado.
- Tom de **console calmo**: competente, direto, sem euforia de marketing dentro do app.
- Familiaridade é feature: padrões shadcn/Linear/Stripe. O usuário fluente nas melhores ferramentas deve sentar e confiar de imediato.

## Tone

- Direto e funcional. Labels curtos, sem jargão de vendas dentro do produto.
- PT-BR natural (não tradução literal). Sem em dash. Sem ponto de exclamação fora de alertas/sucesso.
- Mensagens de estado claras: o que aconteceu, o que fazer. Erro diz a causa.

## Anti-references

- **Verde neon / "WhatsApp saturado"** como cor de marca. Wablast é teal sóbrio, não lime.
- **Sobras do rebrand âmbar/laranja** (a paleta `brand.*` antiga). Nenhum acento laranja deve restar.
- **Hero-metric SaaS cream**: número gigante + gradiente + selo, padrão de landing genérica, dentro do painel.
- **Crypto/neon-on-black** e **glassmorphism decorativo**.
- **Sidebar flutuante destacada** (a antiga caixinha `fixed top-[20%] w-24`): nav deve ser estrutural, altura total, estilo shadcn.

## Strategic principles

1. **Consistência > surpresa.** Mesmo vocabulário de componente tela a tela. Botão "salvar" igual em todo lugar.
2. **Densidade quando o usuário precisa.** Tabelas e painéis densos são aceitáveis; o usuário está em fluxo de trabalho.
3. **Estado observável.** Todo objeto operacional (dispositivo, chave, webhook, mensagem) mostra status com vocabulário semântico padronizado (ativo, habilitado, entregue, falhou, pendente).
4. **Bilíngue de primeira classe.** PT-BR e EN com paridade total de chaves (next-intl); nunca string solta em inglês numa tela PT.
5. **Self-host primeiro.** Funciona sem billing/Firebase configurados; recursos pagos/promo são secundários e não bloqueiam o núcleo.

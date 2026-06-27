# TextBee — Referência da API REST

Documentação de todos os endpoints da API (NestJS).
Referência interativa também disponível no **Swagger**: `http://localhost:3001` (raiz do servidor).

---

## Base URL

```
http://<HOST>:3001/api/v1
```
- Do próprio PC: `http://localhost:3001/api/v1`
- Da rede local (celular/outro dispositivo): `http://<IP_LAN>:3001/api/v1` (ex.: `http://192.168.100.2:3001/api/v1`)

Todas as rotas abaixo são relativas a essa base.

---

## Autenticação

Dois métodos aceitos (no header):

| Método | Header | Uso |
|---|---|---|
| **API Key** | `x-api-key: <SUA_API_KEY>` | integrações/servidores (recomendado). Também aceita `?apiKey=<key>` na query. |
| **JWT** | `Authorization: Bearer <token>` | sessão do dashboard (obtido no `/auth/login`). |

Rotas marcadas **🔓 pública** não exigem auth. As demais exigem um dos métodos acima.
Rotas de device (`/gateway/devices/:id/...`) exigem que a key/usuário seja **dono do device**.

> A API key é mostrada **uma única vez** ao gerar. Guarde com segurança.

---

## 📱 Gateway / SMS  (`/gateway`)

### Enviar SMS
```
POST /gateway/devices/{deviceId}/send-sms
```
(alias legado: `POST /gateway/devices/{deviceId}/sendSMS`)

Body:
```json
{
  "recipients": ["+5561999999999", "+5511988888888"],
  "message": "Texto da mensagem",
  "simSubscriptionId": 0,
  "scheduledAt": "2026-07-01T10:30:00Z"
}
```
| Campo | Obrigatório | Descrição |
|---|---|---|
| `recipients` | sim | lista de números (formato internacional `+55...`) |
| `message` | sim | texto (SMS longo é dividido/concatenado automaticamente) |
| `simSubscriptionId` | não | qual SIM usar (dual-chip) |
| `scheduledAt` | não | ISO 8601 futuro — **requer fila/Redis habilitado** |

Resposta:
```json
{ "data": { "responses": [{ "success": true, "messageId": "projects/.../messages/0:..." }],
            "successCount": 1, "failureCount": 0 } }
```

### Enviar SMS em massa (mensagens distintas)
```
POST /gateway/devices/{deviceId}/send-bulk-sms
```
Body:
```json
{
  "messageTemplate": "opcional",
  "messages": [
    { "message": "Olá A", "recipients": ["+5561..."] },
    { "message": "Olá B", "recipients": ["+5511...", "+5521..."] }
  ]
}
```

### Listar SMS recebidos
```
GET /gateway/devices/{deviceId}/get-received-sms?page=1&limit=50
```
(alias legado: `/getReceivedSMS`) — `limit` máx. 100.

### Histórico de mensagens (enviadas + recebidas)
```
GET /gateway/devices/{deviceId}/messages?page=1&limit=50&type=all
```
`type`: `all` | `sent` | `received`.

### Detalhe de 1 SMS
```
GET /gateway/devices/{deviceId}/sms/{smsId}
```

### Detalhe de um batch (lote) de SMS
```
GET /gateway/devices/{deviceId}/sms-batch/{smsBatchId}
```

### Estatísticas do usuário
```
GET /gateway/stats
```

### Devices
```
GET    /gateway/devices                      # lista devices do usuário
POST   /gateway/devices                      # registra device (usado pelo app)
PATCH  /gateway/devices/{deviceId}           # atualiza device (ex.: enabled, name)
DELETE /gateway/devices/{deviceId}           # remove device
POST   /gateway/devices/{deviceId}/heartbeat # heartbeat (usado pelo app)
PATCH  /gateway/devices/{deviceId}/sms-status # atualiza status de SMS (usado pelo app)
POST   /gateway/devices/{deviceId}/receive-sms # registra SMS recebido (usado pelo app)
```

Body do `PATCH /devices/{id}` (campos úteis): `{ "enabled": true, "name": "Gateway Sala" }`.

> Os endpoints marcados *(usado pelo app)* são chamados pelo app Android automaticamente
> — normalmente você não precisa chamá-los manualmente.

---

## 🔑 Auth & API Keys  (`/auth`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/register` | 🔓 | criar conta. Body: `{ name, email, password, phone? }` |
| POST | `/auth/login` | 🔓 | login. Body: `{ email, password }` → retorna JWT |
| POST | `/auth/google-login` | 🔓 | login via Google |
| GET | `/auth/who-am-i` | JWT/key | dados do usuário logado |
| PATCH | `/auth/update-profile` | JWT/key | atualizar perfil |
| POST | `/auth/change-password` | JWT/key | trocar senha |
| POST | `/auth/api-keys` | JWT/key | **gerar nova API key** |
| GET | `/auth/api-keys` | JWT/key | listar API keys |
| DELETE | `/auth/api-keys/{id}` | JWT/key | excluir API key |
| POST | `/auth/api-keys/{id}/revoke` | JWT/key | revogar API key |
| PATCH | `/auth/api-keys/{id}/rename` | JWT/key | renomear API key |
| PATCH | `/auth/onboarding` | JWT/key | atualizar passo do onboarding |
| POST | `/auth/request-password-reset` | 🔓 | pedir reset de senha (precisa SMTP) |
| POST | `/auth/reset-password` | 🔓 | redefinir senha com código |
| POST | `/auth/send-email-verification-email` | JWT/key | reenviar verificação (precisa SMTP) |
| POST | `/auth/verify-email` | 🔓 | Body: `{ userId, verificationCode }` |

> **Sem SMTP configurado** (`MAIL_*` vazios) não há envio de email — verifique email/reset
> manualmente no Mongo (ver tutorial de self-hosting).

---

## 🔔 Webhooks  (`/webhooks`)  — todos exigem JWT

Notificações em tempo real de eventos de SMS (até 5 por conta).

| Método | Rota | Descrição |
|---|---|---|
| GET | `/webhooks` | listar webhooks |
| GET | `/webhooks/notifications` | notificações de entrega |
| GET | `/webhooks/{webhookId}` | detalhe |
| POST | `/webhooks` | criar webhook |
| PATCH | `/webhooks/{webhookId}` | atualizar |
| DELETE | `/webhooks/{webhookId}` | remover |

---

## 💳 Billing  (`/billing`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/billing/plans` | 🔓 | listar planos |
| GET | `/billing/current-subscription` | JWT | assinatura atual |
| GET | `/billing/notifications` | JWT | notificações de billing |
| POST | `/billing/checkout` | JWT | iniciar checkout (Polar) |
| POST | `/billing/change-plan` | JWT | trocar plano |
| POST | `/billing/webhook/polar` | 🔓 (assinado) | webhook do Polar |

> No self-host, billing/planos são opcionais. Sem plano, o backend usa o plano `free`
> (se existir na base) — veja limites em `canPerformAction`.

---

## 🆘 Support  (`/support`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/support/customer-support` | opcional | mensagem de suporte |
| POST | `/support/request-account-deletion` | JWT | solicitar exclusão de conta |

---

## Exemplos rápidos (envio de SMS)

**cURL:**
```bash
curl -X POST http://192.168.100.2:3001/api/v1/gateway/devices/{DEVICE_ID}/send-sms \
  -H "x-api-key: SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"recipients":["+5561999999999"],"message":"Olá via API"}'
```

**Node.js:**
```js
const res = await fetch(
  `http://192.168.100.2:3001/api/v1/gateway/devices/${DEVICE_ID}/send-sms`,
  {
    method: "POST",
    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ recipients: ["+5561999999999"], message: "Olá via API" }),
  },
)
console.log(await res.json())
```

**Python:**
```python
import requests
r = requests.post(
    f"http://192.168.100.2:3001/api/v1/gateway/devices/{DEVICE_ID}/send-sms",
    headers={"x-api-key": API_KEY},
    json={"recipients": ["+5561999999999"], "message": "Olá via API"},
)
print(r.json())
```

---

## Notas

- **Números**: formato internacional `+55DDDNUMERO`.
- **Status do SMS**: a resposta do POST traz `successCount`/`messageId` (comando enviado via FCM).
  O status real (`pending` → `sent`/`delivered`/`failed`) é atualizado pelo celular depois;
  consulte via `GET /gateway/devices/{id}/sms/{smsId}` ou `/messages`.
- **Só texto**: não há suporte a MMS/imagem. Para enviar imagem, envie uma **URL** no texto.
- **Pré-requisitos do gateway**: celular na mesma rede do servidor, app ativo (sem otimização
  de bateria), chip padrão de SMS **com crédito**. Detalhes em `SELF_HOSTING_LOCAL_PTBR.md`.

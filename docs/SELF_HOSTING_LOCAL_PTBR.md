# TextBee — Guia de Self-Hosting Local (Windows + Docker)

Tutorial completo pra rodar o TextBee 100% na sua máquina (API + dashboard web + MongoDB)
e transformar um celular Android em gateway de SMS, usando seu próprio projeto Firebase.

Testado em: Windows 11, Node 24, pnpm 10, Docker Desktop, JDK 17, Android SDK 34.

> **Importante:** o TextBee envia SMS pelo **chip do celular gateway** (via operadora),
> não por internet. O celular precisa de um chip com **plano/crédito de SMS**.

---

## 1. Pré-requisitos

| Ferramenta | Uso |
|---|---|
| Node.js 20+ e pnpm | rodar API (NestJS) e web (Next.js) |
| Docker Desktop | MongoDB local (e Redis, se usar fila) |
| Git | clonar o repositório |
| JDK 17 + Android SDK 34 | buildar o APK Android (só se for buildar o app) |
| Projeto Firebase | Cloud Messaging (FCM) — servidor manda comando pro celular |

---

## 2. Clonar e instalar

```bash
git clone https://github.com/giovani-junior-dev/textbee.git
cd textbee

# API
cd api && cp .env.example .env && pnpm install && cd ..

# Web
cd web && cp .env.example .env && pnpm install && cd ..
```

---

## 3. MongoDB local (Docker)

```bash
docker run -d --name textbee-db -p 27018:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=adminUser \
  -e MONGO_INITDB_ROOT_PASSWORD=adminPassword \
  -e MONGO_INITDB_DATABASE=textbee \
  -v textbee_mongodb_data:/data/db \
  --restart unless-stopped \
  mongo:latest
```

> Porta **27018** no host pra não conflitar com um Mongo local em 27017.
> Reiniciar depois: `docker start textbee-db`.

---

## 4. Firebase (FCM) — obrigatório pro celular funcionar

O servidor usa o Firebase Cloud Messaging pra enviar o comando "envie esse SMS" ao celular.

1. https://console.firebase.google.com → **Criar projeto** (pode desativar Analytics).
2. **Configurações do projeto → Contas de serviço → Gerar nova chave privada** → baixa um JSON.
3. Preencha em `api/.env` com os campos do JSON:
   - `FIREBASE_PROJECT_ID` = `project_id`
   - `FIREBASE_PRIVATE_KEY_ID` = `private_key_id`
   - `FIREBASE_PRIVATE_KEY` = `private_key` (entre **aspas duplas**, mantendo os `\n` literais)
   - `FIREBASE_CLIENT_EMAIL` = `client_email`
   - `FIREBASE_CLIENT_ID` = `client_id`
   - `FIREBASE_CLIENT_C509_CERT_URL` = `client_x509_cert_url`
4. **Adicionar app → Android**, package name **`com.vernu.sms`** (flavor prod) →
   baixe `google-services.json` e coloque em `android/app/google-services.json`.

> O JSON da chave privada é **secret** — nunca commitar. Os valores ficam no `.env` (que é gitignored).

---

## 5. Configurar os `.env`

### `api/.env` (mínimo pra rodar)
```env
PORT=3001
MONGO_URI=mongodb://adminUser:adminPassword@localhost:27018/textbee?authSource=admin
JWT_SECRET=<string-aleatoria-longa>
JWT_EXPIRATION=60d
FRONTEND_URL=http://localhost:3000
# FIREBASE_* (ver passo 4)
# Turnstile de teste (passa sozinho em dev):
CLOUDFLARE_TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

> **NÃO** coloque `USE_SMS_QUEUE=false` no `.env` a menos que vá rodar Redis.
> Veja a seção **Bugs corrigidos** abaixo — deixe a variável **ausente** pra envio direto.

### `web/.env`
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3002
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
AUTH_SECRET=<string-aleatoria-32>
DATABASE_URL=mongodb://adminUser:adminPassword@localhost:27018/textbee?authSource=admin
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

Gerar secrets (PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | % {Get-Random -Max 256}))
```

---

## 6. Rodar API e Web

```bash
# API  -> http://localhost:3001  (Swagger na raiz)
cd api && pnpm start:dev

# Web  -> http://localhost:3002
cd web && pnpm dev -- -p 3002
```

> Se a porta 3000 estiver ocupada (ex.: WSL), suba o web em 3002 como acima
> e ajuste `NEXT_PUBLIC_SITE_URL`.

---

## 7. Buildar o APK Android (gateway)

Necessário **JDK 17** + **Android SDK 34**. O app oficial da loja **não serve**
(aponta pro servidor público + Firebase deles).

1. `android/local.properties`:
   ```
   sdk.dir=C\:\\Caminho\\Para\\Android\\Sdk
   ```
2. `android/app/src/main/AndroidManifest.xml` — permitir HTTP em rede local
   (já incluso neste fork): `android:usesCleartextTraffic="true"` no `<application>`.
3. `android/app/build.gradle` — no flavor **prod**, aponte `API_BASE_URL` para o
   **IP da sua máquina na LAN** (não `localhost` — o celular não enxerga localhost do PC):
   ```gradle
   buildConfigField "String", "API_BASE_URL", '"http://SEU_IP_LAN:3001/api/v1/"'
   ```
   Descubra o IP: `ipconfig` (Windows) → IPv4 da Wi-Fi (ex.: `192.168.100.2`).
4. Gerar o debug keystore (o build.gradle usa `System.getenv("HOME")`):
   ```powershell
   keytool -genkeypair -v -keystore "$env:USERPROFILE\.android\debug.keystore" `
     -storepass android -alias androiddebugkey -keypass android `
     -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
   ```
5. Buildar (com `HOME` setado pro keystore ser encontrado):
   ```powershell
   $env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17..."
   $env:ANDROID_HOME="C:\Android\Sdk"; $env:HOME=$env:USERPROFILE
   cd android; .\gradlew.bat :app:assembleProdDebug --no-daemon
   ```
   APK em: `android/app/build/outputs/apk/prod/debug/app-prod-debug.apk`

---

## 8. Liberar firewall (Windows)

Pro celular alcançar a API na porta 3001 (rode como **administrador**):
```powershell
New-NetFirewallRule -DisplayName "TextBee-API-3001" -Direction Inbound `
  -LocalPort 3001 -Protocol TCP -Action Allow -Profile Any
```

---

## 9. Parear o celular

1. Dashboard `http://localhost:3002` → crie conta (login por email).
2. **Generate API Key** → copie (mostrada **uma vez**).
3. Instale o APK no celular (Play Protect: "Instalar mesmo assim").
4. Abra o app → escaneie o QR ou digite a API key → conceda **permissão de SMS**.
5. O device aparece no dashboard.

---

## 10. Enviar SMS (API REST)

```bash
curl -X POST http://SEU_IP_LAN:3001/api/v1/gateway/devices/<DEVICE_ID>/send-sms \
  -H "x-api-key: <SUA_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"recipients":["+5561999999999"],"message":"Olá do TextBee self-hosted"}'
```

---

## Gotchas (lado do celular) — leia se o SMS ficar "pending"

- **Mesma Wi-Fi:** o celular precisa estar na mesma rede do PC. Ele recebe o comando
  por FCM (qualquer internet), mas **reporta status / busca dados via LAN** (`SEU_IP_LAN:3001`).
  No 4G/dados móveis o FCM chega mas o app não alcança o servidor → fica `pending`.
- **App ativo / bateria:** mantenha o app aberto e **desative a otimização de bateria**
  do TextBee. Em background o Android (doze) atrasa/segura o push FCM.
- **Chip padrão de SMS + crédito:** o chip do gateway precisa estar definido como
  app/SIM padrão de SMS e ter **crédito/plano**. Sem isso → status `failed`.
- **Verificação de email:** sem SMTP configurado (`MAIL_*` vazios) nenhum email é enviado.
  Verifique manualmente no Mongo:
  ```js
  db.users.updateOne({email:"voce@exemplo.com"}, {$set:{emailVerifiedAt:new Date()}})
  ```

---

## Bugs corrigidos neste fork

### 1. `USE_SMS_QUEUE` string `"false"` ativava a fila (envio travava)
`sms-queue.service.ts` fazia `configService.get<boolean>('USE_SMS_QUEUE', false)`.
O `@nestjs/config` **não converte** string→boolean: a string `"false"` é **truthy**,
então a fila (Bull/**Redis**) era considerada ativa. Sem Redis rodando, `send-sms`
**pendurava** (HTTP timeout, SMS preso em `pending` / batch em `processing`).

**Correção:** coerção explícita — só `"true"/"1"/"yes"` ativam a fila.
Com isso, `USE_SMS_QUEUE` ausente ou `false` faz envio **direto via FCM**.

### 2. Firebase derrubava a API quando as credenciais estavam vazias
`main.ts` chamava `firebase.initializeApp({ credential: cert(...) })` sempre.
Sem `FIREBASE_*` preenchido → `FirebaseAppError` (unhandled rejection) no boot.

**Correção:** init do Firebase só roda quando `projectId` e `privateKey` existem;
caso contrário loga um aviso e a API sobe normalmente (FCM desativado).

---

## Reiniciar tudo depois de reboot

```powershell
docker start textbee-db
cd api;  $env:HOME=$env:USERPROFILE; pnpm start:dev      # :3001
cd web;  pnpm dev -- -p 3002                              # :3002
```

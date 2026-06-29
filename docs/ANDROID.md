# App Android — Wablast SMS

Rebrand (teal + marca "sms") e tradução PT-BR do app Android, mais instruções de build.
Cobre o estado da branch `feat/i18n-rebranding-wablast`.

> Visão geral do rebrand: [REBRANDING.md](./REBRANDING.md). Self-hosting completo
> (Firebase, pareamento, gateway 24/7): [SELF_HOSTING_LOCAL_PTBR.md](./SELF_HOSTING_LOCAL_PTBR.md).
> Docs internos do projeto Android: `android/BUILD_VARIANTS_SETUP.md`, `android/MIGRATION.md`.

---

## 1. Duas UIs: Compose (shipada) vs XML (legada)

> **Importante para quem for editar.** A UI que o app **realmente mostra** é a **Compose**:
> `SplashActivity` → onboarding → dashboard → settings → messages
> (`app/src/main/java/com/vernu/sms/ui/...`). A UI **XML** (`MainActivity` + `res/layout`)
> é **legada** e não é o fluxo principal. Mude o Compose para alterar o app shipado.

Estrutura Compose: `ui/splash`, `ui/onboarding/screens`, `ui/dashboard`, `ui/settings`,
`ui/messages`, `ui/theme` (`Color.kt`, tema).

---

## 2. Identidade aplicada

- **Nome do app → "Wablast SMS"** em `app/build.gradle`:
  - flavor `prod` → `resValue "string", "app_name", "Wablast SMS"`
  - flavor `dev` → `"Wablast SMS (Dev)"`
- **Tema teal:**
  - Themes XML (day + night).
  - Compose `ui/theme/Color.kt`: laranja → teal (`#006149` claro / `#1EB88A`–`#0E9268` escuro).
- **Ícones:**
  - Launcher (adaptive + legacy + round, todas as densidades) → marca "sms".
  - Logo interno `ic_app_logo.webp` → marca "sms" (círculo branco + sms preto).

---

## 3. Tradução PT-BR

O app é pensado **só para PT-BR (Brasil)** — não há toggle de idioma.

- **UI XML:** 56 strings (`res/values/strings.xml`).
- **UI Compose:** 202 strings em 14 arquivos.
- **Toasts** Java/Kotlin: 21.

---

## 4. Ajustes de UI desta fase

- **Configurações** enxugado: removidas as seções **Comunidade**, **Jurídico**, **UI** e o item **"Verificar atualizações"**.
- **Dashboard:** removida a seção **"Ações rápidas"** (botões Painel + Ver documentação).
- **About:** removido **GitHub**; site → `https://sms.wablastmessage.com`.
- **Links user-facing** com "textbee" → `sms.wablastmessage.com`.
  Mantidos de propósito: API de dev `api.dev.textbee.dev`, identificadores internos, package `com.vernu.sms`.

---

## 5. Flavors e configuração de API

`app/build.gradle` (versionCode 18 / versionName 2.8.0):

| Flavor | applicationId | `API_BASE_URL` |
|---|---|---|
| `dev` | `com.vernu.sms.dev` | `https://api.dev.textbee.dev/api/v1/` |
| `prod` | `com.vernu.sms` | `http://192.168.100.2:3001/api/v1/` (IP da LAN local) |

> O `prod` aponta para o **IP da máquina na LAN** porque o celular não enxerga `localhost`
> do PC. Ajuste esse IP (`ipconfig` → IPv4 da Wi-Fi) para o seu ambiente.

---

## 6. Build (Windows)

Pré-requisitos: **JDK 17** + **Android SDK 34**.

### Workaround obrigatório no Windows (`HOME` nulo)
`app/build.gradle` resolve o keystore de debug via `System.getenv("HOME")`, que é **null no
Windows** (lá a variável é `USERPROFILE`). Sem definir `HOME`, o build falha por não achar o
keystore. Defina `HOME` apontando para o seu perfil antes de buildar.

```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:HOME      = "C:\Users\GEOVANE"          # ou $env:USERPROFILE
$env:ANDROID_HOME = "C:\Android\Sdk"          # se ainda não setado

cd android
.\gradlew.bat :app:assembleProdDebug --no-daemon
```

Se ainda não existir o keystore de debug, gere-o uma vez:

```powershell
keytool -genkeypair -v -keystore "$env:HOME\.android\debug.keystore" `
  -storepass android -alias androiddebugkey -keypass android `
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
```

**APK gerado:** `android/app/build/outputs/apk/prod/debug/app-prod-debug.apk`

> O app oficial da loja **não serve** para self-hosting (aponta para o servidor público +
> Firebase deles). É preciso buildar este flavor com seu `google-services.json` e seu IP.

---

## 7. Pendências

- **App mobile:** experimental — nada além do já feito nesta fase.
- **Repontamento de links** (Linear **SCR-411**): a parte web tem itens 🟡 aguardando a VPS;
  no Android os links user-facing já foram repontados. Detalhes em
  [REBRANDING.md](./REBRANDING.md#5-varredura-de-links-e-pendências-scr-411).
</content>

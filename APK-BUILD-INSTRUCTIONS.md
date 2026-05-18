# Como gerar APK do FolderForge AI

Eu já deixei o projeto com PWA + Capacitor Android configurado.

## Requisitos para gerar o APK

No computador:

- Node.js instalado
- Android Studio instalado
- Android SDK configurado
- Gradle funcionando

## Comandos

```bash
npm install
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

O APK debug fica em:

```txt
android/app/build/outputs/apk/debug/app-debug.apk
```

## Abrir no Android Studio

```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

Depois clique em **Build > Build APK(s)**.

## Observação

Neste ambiente onde o ZIP foi gerado, a compilação do APK não pôde ser finalizada porque o Gradle tentou baixar dependências externas e a rede para `services.gradle.org` não estava disponível. Por isso o pacote entregue já vem pronto para compilar em um ambiente Android normal.

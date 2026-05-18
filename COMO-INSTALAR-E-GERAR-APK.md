# FolderForge AI: PWA + APK

Este projeto já está pronto como PWA e como projeto Android via Capacitor.

## Caminho 1: instalar agora no celular como PWA

No Termux:

```bash
pkg update && pkg upgrade
pkg install nodejs unzip
cp /sdcard/Download/folderforge-ai-pwa-android.zip ~/
cd ~
unzip folderforge-ai-pwa-android.zip
cd folderforge-ai
npm install
npm run dev -- --host 0.0.0.0
```

Abra no Chrome:

```txt
http://127.0.0.1:5173
```

Depois toque em **Instalar PWA** ou no menu do Chrome > **Adicionar à tela inicial**.

## Caminho 2: gerar APK no Android Studio

1. Instale o Android Studio.
2. Abra a pasta `folderforge-ai/android`.
3. Espere o Gradle sincronizar.
4. Vá em `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
5. O APK fica em:

```txt
android/app/build/outputs/apk/debug/app-debug.apk
```

## Caminho 3: gerar APK automaticamente no GitHub

O projeto já inclui:

```txt
.github/workflows/build-android-apk.yml
```

Passos:

1. Crie um repositório no GitHub.
2. Envie todos os arquivos deste projeto.
3. Abra a aba **Actions**.
4. Rode o workflow **Build Android APK**.
5. Baixe o artifact `folderforge-debug-apk`.

Esse caminho contorna a limitação de máquina local, porque o GitHub fornece Android SDK, Java e internet para baixar o Gradle.

## Caminho 4: tentar gerar APK no Termux

Pode funcionar, mas depende do Android SDK no Termux. Rode:

```bash
bash scripts/build-apk-termux.sh
```

Se falhar em `gradle` ou `android.jar`, use o caminho do GitHub Actions ou Android Studio.

## Observação importante

Aqui o `.apk` não foi gerado porque o ambiente de execução bloqueou downloads externos, incluindo o arquivo do Gradle Wrapper. O app em si está pronto; a limitação é só o empacotamento Android final.

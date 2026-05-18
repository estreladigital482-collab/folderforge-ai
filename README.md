# FolderForge AI

App local/PWA para gerar estruturas organizadas de pastas, arquivos, prompts e tasks para IAs programadoras.

## Rodar no computador ou Termux

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Abra o endereço mostrado no terminal, normalmente:

```txt
http://127.0.0.1:5173
```

## Instalar como PWA no Android

1. Rode o app com `npm run dev -- --host 0.0.0.0` ou faça deploy em uma URL HTTPS.
2. Abra no Chrome/Edge do Android.
3. Toque no botão **Instalar PWA** dentro do app, ou use o menu do navegador e escolha **Instalar app** / **Adicionar à tela inicial**.

> Para instalação PWA completa fora de localhost, o navegador normalmente exige HTTPS.

## Build de produção

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

## O que esta versão inclui

- Visual cyberpunk dark com grid animado/parallax.
- Logo neon sem nome, pronta para ícone.
- Manifest PWA.
- Service Worker simples para cache/offline básico.
- Ícones Android/iOS em múltiplos tamanhos.
- Botão de instalação PWA.
- Gerador de ZIP com estrutura de projeto para IA.
- Prompt mestre e documentação inicial gerados automaticamente.

## APK

Esta versão está pronta como PWA. Para gerar APK nativo, use uma camada como Capacitor ou Bubblewrap/TWA em um ambiente com Android Studio, Android SDK e Gradle configurados.

## Gerar APK

Veja `COMO-INSTALAR-E-GERAR-APK.md`.

O projeto inclui um workflow do GitHub Actions para gerar o APK automaticamente em ambiente com Android SDK e internet.

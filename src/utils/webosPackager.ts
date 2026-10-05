import JSZip from 'jszip';

export interface AppInfoConfig {
  appId: string;
  title: string;
  version: string;
  resolution: string; // '1920x1080' or '1080x1920'
  targetUrl: string;
}

export function generateAppInfoJson(config: AppInfoConfig): string {
  const data = {
    id: config.appId || 'com.kiosk.portrait.dashboard',
    version: config.version || '1.0.0',
    vendor: 'Enterprise Signage Labs',
    type: 'web',
    main: 'index.html',
    title: config.title || 'Dashboard Modo Retrato',
    icon: 'icon.png',
    largeIcon: 'largeIcon.png',
    bgColor: '#020617',
    resolution: config.resolution || '1920x1080',
    handlesRelaunch: true,
    requiredMemory: 64,
    supportMouse: true,
    inspectable: true,
    accessibility: {
      supportsAudioGuidance: false,
    },
  };

  return JSON.stringify(data, null, 2);
}

// Generate base64 icon on canvas
export function generateIconDataUrl(size: number, text: string): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // Border
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = Math.max(2, size * 0.04);
      ctx.strokeRect(ctx.lineWidth, ctx.lineWidth, size - ctx.lineWidth * 2, size - ctx.lineWidth * 2);

      // Icon: Rotated TV rectangle
      ctx.save();
      ctx.translate(size / 2, size * 0.44);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = Math.max(3, size * 0.05);
      const rectW = size * 0.38;
      const rectH = size * 0.58;
      ctx.strokeRect(-rectW / 2, -rectH / 2, rectW, rectH);

      // Inner chart bars
      ctx.fillStyle = '#10b981';
      ctx.fillRect(-rectW * 0.35, rectH * 0.1, rectW * 0.2, rectH * 0.3);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-rectW * 0.05, -rectH * 0.1, rectW * 0.2, rectH * 0.5);
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(rectW * 0.25, -rectH * 0.3, rectW * 0.2, rectH * 0.7);
      ctx.restore();

      // Text
      ctx.fillStyle = '#f8fafc';
      ctx.font = `bold ${Math.round(size * 0.14)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(text, size / 2, size * 0.88);
    }

    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, 'image/png');
  });
}

export function generateWebOSLauncherHtml(appUrl: string, rotation: string): string {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>Dashboard Modo Retrato</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 100%; height: 100%; background: #020617; overflow: hidden; }
      iframe { border: 0; width: 100%; height: 100%; }
      #loader {
        position: fixed; inset: 0; display: flex; flex-direction: column;
        align-items: center; justify-content: center; color: #f8fafc; font-family: sans-serif;
        background: #020617; transition: opacity 0.4s ease; z-index: 50;
      }
      .spinner {
        width: 44px; height: 44px; border: 4px solid #1e293b;
        border-top-color: #38bdf8; border-radius: 50%;
        animation: spin 1s linear infinite; margin-bottom: 16px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  </head>
  <body>
    <div id="loader">
      <div class="spinner"></div>
      <p style="font-size: 16px; font-weight: 600;">Iniciando webOS Portrait Kiosk...</p>
      <span style="font-size: 12px; color: #64748b; margin-top: 8px;">Conectando ao Dashboard</span>
    </div>

    <iframe
      id="kiosk-frame"
      src="${appUrl}?rotation=${rotation}&tv=1"
      allow="autoplay; fullscreen"
      onload="document.getElementById('loader').style.opacity = '0'; setTimeout(function(){ document.getElementById('loader').style.display = 'none'; }, 400);"
    ></iframe>

    <script>
      // Mantém TV acordada e captura atalhos do controle remoto webOS
      document.addEventListener('keydown', function(e) {
        // Red (403), Green (404), Yellow (405), Blue (406)
        if (e.keyCode === 404 || e.key === 'r') {
          // Forçar recarregamento ao apertar botão verde
          var f = document.getElementById('kiosk-frame');
          f.src = f.src;
        }
      });
    </script>
  </body>
</html>`;
}

export function generateInstallationGuide(appId: string): string {
  return `====================================================================
GUIA DEFINITIVO: INSTALAÇÃO DO APP MODO RETRATO NA SMART TV LG (webOS)
====================================================================

Este pacote contém todos os arquivos oficiais necessários para executar
o seu painel corporativo em TVs LG posicionadas na vertical (90° ou 270°).

--------------------------------------------------------------------
MÉTODO 1: SEM INSTALAR NADA (VIA NAVEGADOR NATIVO DA TV LG)
--------------------------------------------------------------------
Mais rápido e funciona imediatamente em 100% das Smart TVs LG:
1. Ligue a TV LG e abra o aplicativo "Navegador Web" (Web Browser).
2. Na barra de endereços, digite a URL da sua aplicação.
3. Clique no botão de "Tela Cheia" (ícone de expansão no canto superior direito do navegador).
4. No menu do navegador da TV, clique em Adicionar aos Favoritos ou "Fixar na barra de inicialização".
5. Pronto! O app executará em 90° / 270° preenchendo 100% da tela vertical!

--------------------------------------------------------------------
MÉTODO 2: INSTALAÇÃO NATIVA (.IPK) VIA "webOS DEV MANAGER" (RECOMENDADO)
--------------------------------------------------------------------
O webOS Dev Manager é um programa gratuito com interface gráfica para
Windows e Mac que instala apps na TV LG sem precisar usar linha de comando:

1. Na TV LG, abra a LG Content Store e pesquise por "Developer Mode".
2. Instale o app "Developer Mode" e faça login com sua conta LG (ou crie uma gratuita em developer.lge.com).
3. Ative a chave "Dev Mode Status" para ON. A TV exibirá um IP e uma "Passphrase".
4. No seu computador, baixe e instale o "webOS Dev Manager" (https://github.com/webosbrew/dev-manager-desktop).
5. No webOS Dev Manager, clique em "Add Device", digite o IP da TV e a Passphrase.
6. Clique no botão "Install Application", selecione o pacote gerado por este kit.
7. O aplicativo aparecerá permanentemente no menu principal da TV LG, abrindo direto em modo retrato!

--------------------------------------------------------------------
MÉTODO 3: VIA LINHA DE COMANDO OFICIAL (webOS CLI)
--------------------------------------------------------------------
Se você possui o webOS CLI instalado (ares-cli):

1. Empacotar o app:
   ares-package .

   Isso gerará o arquivo: ${appId}_1.0.0_all.ipk

2. Instalar na TV:
   ares-install ${appId}_1.0.0_all.ipk -d NomeDaSuaTV

3. Iniciar o app na TV:
   ares-launch ${appId} -d NomeDaSuaTV

--------------------------------------------------------------------
MAPA DE TECLAS DO CONTROLE REMOTO LG (MAGIC REMOTE):
--------------------------------------------------------------------
- Seta Esquerda / Direita: Trocar de Dashboard no carrossel
- Botão OK (Scroll): Pausar / Continuar rotação automática
- Botão Voltar (Back): Abrir / Fechar menu de configurações
- Botão Verde: Forçar atualização imediata do Dashboard
- Botão Amarelo: Alternar rotação (90° -> 270° -> 0°)
- Botão Azul: Exibir Guia e Informações

Suporte a TVs: LG webOS 3.0, 3.5, 4.0, 4.5, 5.0, 6.0, 22, 23, 24 e webOS Signage.
`;
}

export async function downloadWebOSZipPackage(config: AppInfoConfig, rotation: string): Promise<void> {
  const zip = new JSZip();

  // 1. appinfo.json
  const appInfoContent = generateAppInfoJson(config);
  zip.file('appinfo.json', appInfoContent);

  // 2. index.html (Launcher)
  const launcherHtml = generateWebOSLauncherHtml(config.targetUrl, rotation);
  zip.file('index.html', launcherHtml);

  // 3. README e Instruções
  const readmeContent = generateInstallationGuide(config.appId);
  zip.file('INSTRUCOES_INSTALACAO_WEBOS.txt', readmeContent);

  // 4. Generate icons (80x80 and 130x130)
  try {
    const icon80Blob = await generateIconDataUrl(80, 'TV 9:16');
    const icon130Blob = await generateIconDataUrl(130, 'PORTRAIT');

    zip.file('icon.png', icon80Blob);
    zip.file('largeIcon.png', icon130Blob);
  } catch (err) {
    // If canvas fails in environment, proceed with json & html
  }

  // Generate and trigger download
  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);

  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `webos-portrait-kiosk-${config.appId}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

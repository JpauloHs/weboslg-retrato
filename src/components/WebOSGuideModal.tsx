import React, { useState } from 'react';
import {
  X,
  Download,
  Tv,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  FileCode,
  Sparkles,
  GitBranch,
  Github,
} from 'lucide-react';
import { downloadWebOSZipPackage } from '../utils/webosPackager';
import { DEFAULT_APP_ID, DEFAULT_APP_TITLE } from '../config/kioskConfig';

interface WebOSGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRotation: string;
}

export const WebOSGuideModal: React.FC<WebOSGuideModalProps> = ({
  isOpen,
  onClose,
  currentRotation,
}) => {
  const [activeStep, setActiveStep] = useState<'github' | 'browser' | 'devmanager' | 'package'>('github');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentAppUrl = window.location.origin;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadWebOSZipPackage(
        {
          appId: DEFAULT_APP_ID,
          title: DEFAULT_APP_TITLE,
          version: '1.0.0',
          resolution: '1920x1080',
          targetUrl: currentAppUrl,
        },
        currentRotation
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const userRepoUrl = 'https://github.com/JpauloHs/weboslg-retrato';
  const userPagesUrl = 'https://jpaulohs.github.io/weboslg-retrato/';

  const gitCommands = `# 1. Adicionar arquivos e correcoes
git add .

# 2. Criar commit
git commit -m "fix: github pages workflow e package-lock"

# 3. Enviar para seu repositorio
git push origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">
                Hospedagem & Implantação na Smart TV LG (webOS)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Como hospedar no GitHub Pages e abrir na TV em modo retrato
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800/80 bg-slate-950/30 overflow-x-auto">
          <button
            onClick={() => setActiveStep('github')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeStep === 'github'
                ? 'border-blue-500 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-4 h-4 text-white" />
            <span>Hospedar no GitHub Pages</span>
          </button>

          <button
            onClick={() => setActiveStep('browser')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeStep === 'browser'
                ? 'border-blue-500 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-4 h-4 text-emerald-400" />
            <span>Navegador da TV LG</span>
          </button>

          <button
            onClick={() => setActiveStep('devmanager')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeStep === 'devmanager'
                ? 'border-blue-500 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-4 h-4 text-blue-400" />
            <span>Instalação .ipk (Dev Manager)</span>
          </button>

          <button
            onClick={() => setActiveStep('package')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeStep === 'package'
                ? 'border-blue-500 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>Pacote appinfo.json</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB: GITHUB */}
          {activeStep === 'github' && (
            <div className="space-y-4">
              <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
                <Github className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white">Hospedagem Gratuita com HTTPS no GitHub Pages:</span>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    Este projeto já possui o workflow <code className="text-blue-300">.github/workflows/deploy.yml</code> e o <code className="text-blue-300">vite.config.ts</code> configurados para compilar e publicar automaticamente no GitHub Pages!
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Passo 1: Criar um Repositório no GitHub
                  </span>
                  <a
                    href="https://github.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Criar Repositório</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-300">
                  Dê um nome ao repositório (ex: <code className="text-emerald-400 font-mono">webos-portrait-looker</code>), selecione <strong>Public</strong> e clique em <em>Create repository</em> (sem adicionar README).
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Passo 2: Comandos Git para Enviar o Projeto
                  </span>
                  <button
                    onClick={() => copyToClipboard(gitCommands, 5)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedIndex === 5 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 5 ? 'Copiado!' : 'Copiar Comandos'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 p-3 rounded-lg text-[11px] font-mono text-cyan-300 overflow-x-auto border border-slate-800">
                  {gitCommands}
                </pre>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block">
                  Passo 3: Ativar o GitHub Pages no Repositório
                </span>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>No seu repositório no GitHub, clique na aba <strong>Settings</strong>.</li>
                  <li>No menu lateral esquerdo, clique em <strong>Pages</strong>.</li>
                  <li>Em <strong>Build and deployment &gt; Source</strong>, selecione <strong>GitHub Actions</strong>.</li>
                  <li>Em cerca de 1 minuto, o GitHub publicará seu link oficial: <code className="text-emerald-400 font-mono">https://SEU_USUARIO.github.io/webos-portrait-looker/</code></li>
                </ol>
              </div>
            </div>
          )}

          {/* METHOD: BROWSER */}
          {activeStep === 'browser' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-800/50 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white">Abertura Imediata na Smart TV LG:</span>
                  <p className="text-slate-300 mt-1">
                    Funciona em 100% dos modelos LG webOS. O navegador da TV salva seu login da conta Google.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-white block">
                    1. Digitar o link no navegador da TV LG
                  </span>
                  <p className="text-xs text-slate-300">
                    Abra o app <strong>"Navegador da Web"</strong> na sua TV LG e digite a URL hospedada:
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      readOnly
                      value={currentAppUrl}
                      className="flex-1 bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-xs font-mono text-emerald-400 select-all"
                    />
                    <button
                      onClick={() => copyToClipboard(currentAppUrl, 1)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedIndex === 1 ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-white block">
                    2. Autenticar credenciais Google na TV
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    No navegador da TV, faça login na sua conta Google que tem acesso ao Looker Studio (ou acesse <code className="text-emerald-400 font-mono">accounts.google.com</code>). O navegador salvará os cookies de acesso.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-white block">
                    3. Tela Cheia & Atalho no Controle Remoto
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Clique no botão de <strong>Tela Cheia</strong> do navegador da TV. Em seguida, mantenha a tecla <strong>1</strong> do controle remoto pressionada por 3 segundos para criar um <em>Acesso Rápido</em> (Quick Access).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* METHOD: DEV MANAGER */}
          {activeStep === 'devmanager' && (
            <div className="space-y-4">
              <div className="bg-blue-950/40 border border-blue-800/50 p-4 rounded-xl flex items-start gap-3">
                <Laptop className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white">Instalação Nativa como Aplicativo LG webOS:</span>
                  <p className="text-slate-300 mt-1">
                    Cria um ícone oficial na barra de aplicativos da Smart TV LG sem abrir o navegador.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-white block">1. Ativar Developer Mode na TV LG</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Na TV LG, entre na <strong>LG Content Store</strong> e instale o app <strong>"Developer Mode"</strong>. Ligue a opção <strong>"Dev Mode Status"</strong>. A TV mostrará o IP e a Passphrase.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-white block">2. Usar o webOS Dev Manager (Windows/Mac)</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Baixe o programa gratuito com interface gráfica:
                  </p>
                  <a
                    href="https://github.com/webosbrew/dev-manager-desktop/releases"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline"
                  >
                    <span>https://github.com/webosbrew/dev-manager-desktop</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-xs text-slate-400 mt-1">
                    Conecte ao IP da TV e instale o pacote gerado pelo botão abaixo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* METHOD: PACKAGE */}
          {activeStep === 'package' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white">Configuração Oficial appinfo.json</span>
                <pre className="bg-slate-900 p-3 rounded-lg text-[11px] font-mono text-cyan-300 overflow-x-auto border border-slate-800">
{`{
  "id": "${DEFAULT_APP_ID}",
  "version": "1.0.0",
  "vendor": "Enterprise Signage Labs",
  "type": "web",
  "main": "index.html",
  "title": "${DEFAULT_APP_TITLE}",
  "icon": "icon.png",
  "largeIcon": "largeIcon.png",
  "bgColor": "#020617",
  "resolution": "1920x1080",
  "handlesRelaunch": true,
  "requiredMemory": 64,
  "supportMouse": true
}`}
                </pre>
              </div>
            </div>
          )}

          {/* Download Zip CTA */}
          <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-800/40 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Baixar Pacote do App LG webOS (.ZIP)
              </span>
              <p className="text-[11px] text-slate-400">
                Gera o arquivo compactado com <code className="text-blue-300">appinfo.json</code>, launcher e ícones.
              </p>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Gerando Pacote...' : 'Baixar Pacote webOS'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <span className="text-xs text-slate-500 font-mono">
            Atalhos TV: [Verde] Atualizar · [Amarelo] Rotação
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

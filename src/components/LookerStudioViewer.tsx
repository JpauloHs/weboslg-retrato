import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ExternalLink, RefreshCw, KeyRound, AlertTriangle, ShieldCheck, Moon, Sun, CheckCircle } from 'lucide-react';

interface LookerStudioViewerProps {
  url: string;
  useEmbedMode: boolean;
  refreshTrigger: number;
  lastRefreshTime?: Date;
}

export const LookerStudioViewer: React.FC<LookerStudioViewerProps> = ({
  url,
  useEmbedMode,
  refreshTrigger,
  lastRefreshTime,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showAuthGuide, setShowAuthGuide] = useState(false);
  const [isRefreshingToast, setIsRefreshingToast] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate sanitized base URL
  const baseUrl = useMemo(() => {
    if (!url) return '';
    let formatted = url.trim();
    if (useEmbedMode) {
      if (formatted.includes('/reporting/') && !formatted.includes('/embed/reporting/')) {
        formatted = formatted.replace('/reporting/', '/embed/reporting/');
      }
    }
    return formatted;
  }, [url, useEmbedMode]);

  // Compute final iframe URL with cache-busting query parameter on every refreshTrigger!
  const finalUrl = useMemo(() => {
    if (!baseUrl) return '';
    // If refreshTrigger > 0, append timestamp so browser disk cache is bypassed
    if (refreshTrigger > 0) {
      const sep = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${sep}_kiosk_ts=${Date.now()}`;
    }
    return baseUrl;
  }, [baseUrl, refreshTrigger]);

  // Trigger brief visual refresh feedback toast
  useEffect(() => {
    if (refreshTrigger > 0) {
      setIsRefreshingToast(true);
      const timer = setTimeout(() => {
        setIsRefreshingToast(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [refreshTrigger]);

  const handleOpenGoogleLogin = () => {
    window.open('https://accounts.google.com/ServiceLogin', '_blank');
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col overflow-hidden">
      {/* Visual Refresh Indicator Toast */}
      {isRefreshingToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-600/95 text-white px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold animate-bounce border border-blue-400/40">
          <RefreshCw className="w-4 h-4 animate-spin text-white" />
          <span>Atualizando dados do Looker Studio...</span>
        </div>
      )}

      {/* Initial Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xs text-slate-200">
          <RefreshCw className="w-9 h-9 text-blue-500 animate-spin mb-3.5" />
          <p className="text-base font-bold text-white tracking-tight">Carregando Looker Studio...</p>
          <span className="text-xs text-slate-400 font-mono mt-1.5 max-w-md truncate px-6 text-center">
            {finalUrl}
          </span>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sessão segura webOS TV · Modo Anti-Sleep Ativo</span>
          </div>
        </div>
      )}

      {/* Primary Looker Studio Iframe */}
      {finalUrl ? (
        <iframe
          ref={iframeRef}
          key={`looker-frame-${refreshTrigger}`}
          src={finalUrl}
          title="Google Looker Studio"
          className="w-full h-full border-0 bg-white"
          onLoad={() => {
            setIsLoading(false);
            setHasError(false);
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; full-screen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-modals"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
          <h2 className="text-lg font-bold text-white mb-1">Nenhuma URL informada</h2>
          <p className="text-xs max-w-sm">
            Informe a URL do relatório do Looker Studio nas configurações.
          </p>
        </div>
      )}

      {/* Discreet Bottom Bar for TV Authentication & External Link */}
      <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        {showAuthGuide && (
          <div className="bg-slate-900/98 border border-slate-700/80 p-4 rounded-xl shadow-2xl text-left max-w-sm text-xs text-slate-300 mb-2 backdrop-blur-md">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>Credenciais Google na TV LG</span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
              Se o relatório solicitar login na tela da TV, clique em <strong>"Fazer Login Google"</strong> para abrir a página oficial de autenticação da sua conta Google no navegador da TV. Uma vez logado, a TV salva os cookies de acesso.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={handleOpenGoogleLogin}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
              >
                Fazer Login Google Agora
              </button>
              <button
                onClick={() => setShowAuthGuide(false)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowAuthGuide(!showAuthGuide)}
          className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-emerald-400 hover:text-white rounded-lg border border-slate-800 shadow transition-colors cursor-pointer"
          title="Instruções de Login Google"
        >
          <KeyRound className="w-3.5 h-3.5" />
        </button>

        {baseUrl && (
          <a
            href={baseUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 shadow transition-colors"
            title="Abrir diretamente em nova aba"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

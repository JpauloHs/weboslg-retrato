import React, { useState } from 'react';
import {
  X,
  RotateCw,
  Sliders,
  Tv,
  ExternalLink,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { LookerKioskSettings, RotationMode } from '../types';
import { DEFAULT_LOOKER_SETTINGS } from '../config/kioskConfig';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LookerKioskSettings;
  onUpdateSettings: (settings: LookerKioskSettings) => void;
  onOpenGuide: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'rotation' | 'bezel'>('url');
  const [tempUrl, setTempUrl] = useState(settings.url);

  if (!isOpen) return null;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUrl.trim()) return;
    onUpdateSettings({ ...settings, url: tempUrl.trim() });
  };

  const handleResetToDefaultUrl = () => {
    setTempUrl(DEFAULT_LOOKER_SETTINGS.url);
    onUpdateSettings({ ...settings, url: DEFAULT_LOOKER_SETTINGS.url });
  };

  const handleOpenGoogleLogin = () => {
    window.open('https://accounts.google.com/ServiceLogin', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">Ajustes do Looker Studio na TV LG</h2>
              <p className="text-xs text-slate-400 mt-1">
                Calibração de rotação retrato, zoom e credenciais para Smart TV
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800/80 bg-slate-950/30">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
              activeTab === 'url'
                ? 'border-blue-500 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>URL & Credenciais Google</span>
          </button>

          <button
            onClick={() => setActiveTab('rotation')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
              activeTab === 'rotation'
                ? 'border-blue-500 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCw className="w-4 h-4 text-blue-400" />
            <span>Orientação da TV (90° / 270°)</span>
          </button>

          <button
            onClick={() => setActiveTab('bezel')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
              activeTab === 'bezel'
                ? 'border-blue-500 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-4 h-4 text-indigo-400" />
            <span>Ajuste de Tela & Borda</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: URL & GOOGLE CREDENTIALS */}
          {activeTab === 'url' && (
            <div className="space-y-5">
              <form onSubmit={handleSaveUrl} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    URL do Looker Studio / Data Studio
                  </label>
                  <button
                    type="button"
                    onClick={handleResetToDefaultUrl}
                    className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                  >
                    Restaurar URL Original
                  </button>
                </div>
                <input
                  type="url"
                  required
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="https://lookerstudio.google.com/embed/reporting/..."
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                  >
                    Salvar URL
                  </button>
                </div>
              </form>

              {/* Google Authentication Box */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Autenticação de Acesso na Smart TV LG</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Como você possui as credenciais de acesso do Google, clique no botão abaixo para abrir a tela de login do Google no navegador da TV LG e salvar a sessão:
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleOpenGoogleLogin}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Fazer Login Google na TV</span>
                  </button>
                  <span className="text-[11px] text-slate-500">
                    Os cookies são armazenados permanentemente pelo navegador da TV LG.
                  </span>
                </div>
              </div>

              {/* Embed Mode Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Modo Incorporado Limpo (/embed/reporting/)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Oculta cabeçalhos do Google, barras de ferramentas e maximiza o painel na vertical.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ ...settings, useEmbedMode: !settings.useEmbedMode })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.useEmbedMode ? 'bg-blue-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 left-1 ${
                      settings.useEmbedMode ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ROTATION */}
          {activeTab === 'rotation' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">Posição Física da TV no Suporte de Parede</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecione para qual lado a TV foi virada na montagem vertical:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    mode: '90' as RotationMode,
                    title: '90° Sentido Horário',
                    desc: 'O topo da TV foi girado para a DIREITA.',
                    badge: 'Mais Utilizado',
                  },
                  {
                    mode: '270' as RotationMode,
                    title: '270° Anti-horário (90° Esq.)',
                    desc: 'O topo da TV foi girado para a ESQUERDA.',
                    badge: 'Padrão LG',
                  },
                  {
                    mode: '0' as RotationMode,
                    title: '0° Nativo / Signage',
                    desc: 'TVs LG Signage Comercial ou rotação no PC.',
                    badge: 'Vertical Nativo',
                  },
                  {
                    mode: '180' as RotationMode,
                    title: '180° Invertido',
                    desc: 'Para suportes de teto ou montagens invertidas.',
                    badge: 'Invertido',
                  },
                ].map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, rotation: item.mode })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      settings.rotation === item.mode
                        ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">{item.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BEZEL & DISPLAY CALIBRATION */}
          {activeTab === 'bezel' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">Calibração de Enquadramento na TV</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evite que a moldura plástica da TV corte os números ou gráficos do Looker Studio.
                </p>
              </div>

              {/* Overscan Margin Slider */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    Margem de Borda da TV (Overscan Safe Area)
                  </span>
                  <span className="font-mono text-blue-400 font-bold">{settings.overscanMargin}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="2"
                  value={settings.overscanMargin}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, overscanMargin: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-[11px] text-slate-500 block">
                  Afasta o conteúdo das quatro bordas físicas da tela da TV.
                </span>
              </div>

              {/* Scale Zoom Slider */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Zoom / Escala Geral</span>
                  <span className="font-mono text-blue-400 font-bold">{settings.scale}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="125"
                  step="1"
                  value={settings.scale}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, scale: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-[11px] text-slate-500 block">
                  Ajusta o tamanho do relatório para preencher 100% da resolução vertical.
                </span>
              </div>

              {/* Auto Refresh */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    Recarregamento Automático Preventivo da TV
                  </span>
                  <span className="font-mono text-blue-400 font-bold">
                    A cada {settings.autoRefreshMinutes} min
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={settings.autoRefreshMinutes}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, autoRefreshMinutes: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-[11px] text-slate-500 block">
                  Recarrega os dados do relatório e limpa a memória RAM do navegador webOS para estabilidade 24 horas.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenGuide();
            }}
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Guia de Instalação na TV LG (webOS)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
          >
            Concluir Ajustes
          </button>
        </div>
      </div>
    </div>
  );
};

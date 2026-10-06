import React, { useState } from 'react';
import {
  X,
  RotateCw,
  Sliders,
  Tv,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Moon,
  Clock,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { LookerKioskSettings, RotationMode } from '../types';
import { DEFAULT_LOOKER_SETTINGS } from '../config/kioskConfig';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LookerKioskSettings;
  onUpdateSettings: (settings: LookerKioskSettings) => void;
  onOpenGuide: () => void;
  onForceRefresh?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenGuide,
  onForceRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'rotation' | 'bezel' | 'sleep'>('sleep');
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
              <h2 className="text-base font-bold text-white leading-none">Ajustes da TV LG & Looker Studio</h2>
              <p className="text-xs text-slate-400 mt-1">
                Controle de sono da TV, rotação vertical, tempo de atualização e zoom
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
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800/80 bg-slate-950/30 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sleep')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'sleep'
                ? 'border-emerald-500 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-4 h-4 text-emerald-400" />
            <span>Anti-Sleep (Não Desligar)</span>
          </button>

          <button
            onClick={() => setActiveTab('rotation')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'rotation'
                ? 'border-blue-500 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCw className="w-4 h-4 text-blue-400" />
            <span>Orientação (90° / 270°)</span>
          </button>

          <button
            onClick={() => setActiveTab('bezel')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'bezel'
                ? 'border-blue-500 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Atualização de Dados & Zoom</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'url'
                ? 'border-blue-500 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <span>URL & Login Google</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB: ANTI-SLEEP (PREVENT 30 MIN SHUTDOWN) */}
          {activeTab === 'sleep' && (
            <div className="space-y-5">
              {/* Software Keep-Awake Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-950 border border-emerald-900/60 rounded-xl">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">
                      Motor Anti-Sleep 24/7 (Transmissão de Mídia Ativa)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Mantém um stream de mídia contínuo ativo no navegador webOS. A TV LG interpreta que há um vídeo sendo reproduzido e suspende a proteção de tela.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ ...settings, antiSleepActive: !settings.antiSleepActive })
                  }
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 ml-4 ${
                    settings.antiSleepActive ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-4.5 h-4.5 bg-white rounded-full transition-transform absolute top-1 left-1 ${
                      settings.antiSleepActive ? 'translate-x-5.5' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Hardware TV Settings Guide - CRITICAL FOR 30-MIN TIMER */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Configuração Obrigatória no Menu Físico da TV LG:</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  As TVs LG possuem um temporizador de fábrica chamado <strong>"Economia de Energia"</strong> e <strong>"Modo de Espera Automático"</strong> que desliga o painel após 30 min ou 2 horas. Para desativar permanentemente:
                </p>

                <div className="space-y-2 text-xs bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 text-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-emerald-400 font-bold shrink-0">1.</span>
                    <span>No controle remoto LG, aperte o botão de <strong>Engrenagem (Configurações)</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-emerald-400 font-bold shrink-0">2.</span>
                    <span>Vá em <strong>Todas as Configurações ➔ Geral ➔ Economia de Energia</strong> (ou Cuidados OLED/Painel) e selecione <strong>DESLIGADO</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-emerald-400 font-bold shrink-0">3.</span>
                    <span>Vá em <strong>Geral ➔ Sistema ➔ Tempo e Temporizadores ➔ Desligamento Automático após 4 Horas</strong> (ou Temporizador de Espera) e marque <strong>DESLIGADO</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-emerald-400 font-bold shrink-0">4.</span>
                    <span>(Opcional) Em <strong>Geral ➔ Dispositivos ➔ Modo de Loja/Uso</strong>, alternar para <em>Modo Loja</em> impede qualquer desligamento automático da TV.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ROTATION */}
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
                    mode: '270' as RotationMode,
                    title: '270° Anti-horário (90° Esq.)',
                    desc: 'O topo da TV foi girado para a ESQUERDA.',
                    badge: 'Recomendado',
                  },
                  {
                    mode: '90' as RotationMode,
                    title: '90° Sentido Horário',
                    desc: 'O topo da TV foi girado para a DIREITA.',
                    badge: 'Padrão',
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

          {/* TAB: DATA REFRESH & BEZEL */}
          {activeTab === 'bezel' && (
            <div className="space-y-5">
              {/* Auto Refresh Interval */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-200 block">
                      Intervalo de Atualização dos Dados (Bypass de Cache)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Força o navegador a buscar os dados mais recentes do Google com carimbo de data/hora único.
                    </span>
                  </div>
                  <span className="font-mono text-cyan-400 font-bold text-sm">
                    {settings.autoRefreshMinutes} min
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-1.5 pt-1">
                  {[1, 2, 5, 10, 15, 30].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => onUpdateSettings({ ...settings, autoRefreshMinutes: mins })}
                      className={`py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                        settings.autoRefreshMinutes === mins
                          ? 'bg-cyan-600 border-cyan-500 text-white shadow'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400">
                    Exibir contador regressivo no topo da tela:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings({ ...settings, showCountdown: !settings.showCountdown })
                    }
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      settings.showCountdown ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {settings.showCountdown ? 'Visível' : 'Oculto'}
                  </button>
                </div>
              </div>

              {/* Bezel Safe Area */}
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
                  Afasta o conteúdo das bordas plásticas da TV.
                </span>
              </div>

              {/* Scale Zoom Slider */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Zoom / Escala do Relatório</span>
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
              </div>
            </div>
          )}

          {/* TAB: URL & LOGIN */}
          {activeTab === 'url' && (
            <div className="space-y-5">
              <form onSubmit={handleSaveUrl} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    URL do Looker Studio
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
                  Faça login com a conta Google que tem permissão no Looker Studio diretamente pelo navegador da TV LG:
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
                </div>
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

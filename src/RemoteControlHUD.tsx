import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  RefreshCw,
  Maximize2,
  Minimize2,
  Settings,
  HelpCircle,
  Tv,
  KeyRound,
} from 'lucide-react';
import { LookerKioskSettings, RotationMode } from '../types';

interface RemoteControlHUDProps {
  settings: LookerKioskSettings;
  onRotateChange: (mode: RotationMode) => void;
  onRefresh: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  onToggleSimulator: () => void;
}

export const RemoteControlHUD: React.FC<RemoteControlHUDProps> = ({
  settings,
  onRotateChange,
  onRefresh,
  onOpenSettings,
  onOpenGuide,
  onToggleSimulator,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Time & date updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fullscreen state listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Auto-hide controls when idle
  useEffect(() => {
    if (!settings.autoHideControls) {
      setIsVisible(true);
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const handleActivity = () => {
      setIsVisible(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, settings.autoHideDelaySeconds * 1000);
    };

    handleActivity();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [settings.autoHideControls, settings.autoHideDelaySeconds]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
  };

  const getRotationLabel = (mode: RotationMode) => {
    switch (mode) {
      case '90':
        return '90° Horário (TV Dir.)';
      case '270':
        return '270° Anti-horário (TV Esq.)';
      case '180':
        return '180° Invertido';
      case '0':
      default:
        return '0° Nativo';
    }
  };

  const cycleRotation = () => {
    const sequence: RotationMode[] = ['90', '270', '0', '180'];
    const currentIndex = sequence.indexOf(settings.rotation);
    const nextMode = sequence[(currentIndex + 1) % sequence.length];
    onRotateChange(nextMode);
  };

  const handleOpenGoogleLogin = () => {
    window.open('https://accounts.google.com/ServiceLogin', '_blank');
  };

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Top Bar HUD */}
      <header className="pointer-events-auto absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-transparent flex items-center justify-between text-slate-100 select-none">
        {/* Brand & Looker Identifier */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">webOS Retrato</span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-emerald-400 font-medium">Google Looker Studio</span>
            </div>
            <h2 className="text-sm font-semibold text-white tracking-tight leading-none mt-0.5">
              Dashboard Corporativo 9:16
            </h2>
          </div>
        </div>

        {/* Center: Rotation Button */}
        <button
          onClick={cycleRotation}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700/70 rounded-lg shadow transition-colors cursor-pointer"
          title="Alternar rotação (90° / 270° / 0°)"
        >
          <RotateCw className="w-3.5 h-3.5 text-blue-400" />
          <span>{getRotationLabel(settings.rotation)}</span>
        </button>

        {/* Right Actions & Clock */}
        <div className="flex items-center gap-2">
          {settings.showClock && (
            <div className="text-right hidden sm:block mr-2 font-mono">
              <div className="text-sm font-bold text-white tabular-nums leading-none">
                {currentTime}
              </div>
              <div className="text-[11px] text-slate-400 uppercase mt-0.5">
                {currentDate}
              </div>
            </div>
          )}

          <button
            onClick={handleOpenGoogleLogin}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-emerald-800/60 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Fazer Login na Conta Google na TV para liberar acesso"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Login Google</span>
          </button>

          <button
            onClick={onToggleSimulator}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              settings.tvSimulatorMode
                ? 'bg-blue-600/90 border-blue-500 text-white'
                : 'bg-slate-900/90 border-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Alternar Moldura Simulador TV / Kiosk Direto"
          >
            <Tv className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenGuide}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 rounded-lg transition-colors cursor-pointer"
            title="Guia de Instalação na TV LG webOS"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 rounded-lg transition-colors cursor-pointer"
            title="Ajustes de Rotação, Zoom e Margem de TV"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 rounded-lg transition-colors cursor-pointer"
            title="Modo Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Bottom Floating Control Pill */}
      <footer className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/95 border border-slate-800/90 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 text-slate-200 select-none">
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
          title="Recarregar dados do Looker (Botão Verde do Controle)"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Atualizar Dados</span>
        </button>

        <div className="h-5 w-px bg-slate-800" />

        <button
          onClick={cycleRotation}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
          title="Girar Orientação (Botão Amarelo do Controle)"
        >
          <RotateCw className="w-3.5 h-3.5 text-blue-400" />
          <span>{settings.rotation}°</span>
        </button>

        <div className="h-5 w-px bg-slate-800" />

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
          title="Ajustar Margem / Zoom"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>Ajustar Tela</span>
        </button>
      </footer>

      {/* Remote Control Key Hints (Discreet indicator at bottom left) */}
      <div className="pointer-events-auto absolute bottom-4 left-4 hidden xl:flex items-center gap-2 text-[10px] font-mono text-slate-500 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80">
        <span className="text-emerald-400 font-bold">[Verde]</span> Recarregar
        <span>·</span>
        <span className="text-amber-400 font-bold">[Amarelo]</span> Rotação
        <span>·</span>
        <span className="text-red-400 font-bold">[Vermelho]</span> Ajustes
        <span>·</span>
        <span className="text-blue-400 font-bold">[Azul]</span> Guia TV
      </div>
    </div>
  );
};

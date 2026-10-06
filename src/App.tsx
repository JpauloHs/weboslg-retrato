/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LookerKioskSettings, RotationMode } from './types';
import { DEFAULT_LOOKER_SETTINGS } from './config/kioskConfig';
import { PortraitViewport } from './components/PortraitViewport';
import { LookerStudioViewer } from './components/LookerStudioViewer';
import { RemoteControlHUD } from './components/RemoteControlHUD';
import { SettingsModal } from './components/SettingsModal';
import { WebOSGuideModal } from './components/WebOSGuideModal';
import { TVRemoteSimulator } from './components/TVRemoteSimulator';
import { RotateCw, Tv, HelpCircle, Settings, RefreshCw } from 'lucide-react';

export default function App() {
  // Load settings from localStorage or URL query params
  const [settings, setSettings] = useState<LookerKioskSettings>(() => {
    try {
      const saved = localStorage.getItem('looker_webos_settings');
      let base: LookerKioskSettings = saved ? JSON.parse(saved) : DEFAULT_LOOKER_SETTINGS;

      // Ensure new antiSleep and countdown fields are defaulted if old state was loaded
      if (typeof base.antiSleepActive !== 'boolean') base.antiSleepActive = true;
      if (typeof base.showCountdown !== 'boolean') base.showCountdown = true;
      if (!base.autoRefreshMinutes || base.autoRefreshMinutes <= 0) base.autoRefreshMinutes = 5;

      // URL query overrides (e.g. ?rotation=270&tv=1)
      const params = new URLSearchParams(window.location.search);
      const urlRotation = params.get('rotation');
      if (urlRotation && ['0', '90', '180', '270'].includes(urlRotation)) {
        base.rotation = urlRotation as RotationMode;
      }
      if (params.get('tv') === '1') {
        base.tvSimulatorMode = false;
      }

      return base;
    } catch {
      return DEFAULT_LOOKER_SETTINGS;
    }
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(
    (settings.autoRefreshMinutes || 5) * 60
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('looker_webos_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const handleRotateChange = useCallback((mode: RotationMode) => {
    setSettings((prev) => ({ ...prev, rotation: mode }));
  }, []);

  const handleRotateCycle = useCallback(() => {
    const sequence: RotationMode[] = ['270', '90', '0', '180'];
    const currIdx = sequence.indexOf(settings.rotation);
    const nextMode = sequence[(currIdx + 1) % sequence.length];
    setSettings((prev) => ({ ...prev, rotation: nextMode }));
  }, [settings.rotation]);

  // Force cache-busting refresh
  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setSecondsUntilRefresh((settings.autoRefreshMinutes || 5) * 60);
  }, [settings.autoRefreshMinutes]);

  // Reset countdown whenever autoRefreshMinutes setting changes
  useEffect(() => {
    setSecondsUntilRefresh((settings.autoRefreshMinutes || 5) * 60);
  }, [settings.autoRefreshMinutes]);

  // Active Countdown & Auto-Refresh Timer Loop (1-second precision)
  useEffect(() => {
    if (settings.autoRefreshMinutes <= 0) return;

    const timer = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          // Trigger forced cache-busting refresh!
          setRefreshTrigger((curr) => curr + 1);
          return (settings.autoRefreshMinutes || 5) * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.autoRefreshMinutes]);

  // Physical TV Remote and Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();
          handleRotateCycle();
          break;
        case 'Enter':
        case ' ':
        case 'r':
        case 'R':
          if (e.ctrlKey || e.metaKey) return;
          e.preventDefault();
          handleRefresh();
          break;
        case 'Escape':
        case 'Backspace':
        case 's':
        case 'S':
          setIsSettingsOpen((prev) => !prev);
          break;
        case 'g':
        case 'G':
          setIsGuideOpen((prev) => !prev);
          break;
        default:
          break;
      }

      // webOS Magic Remote color buttons
      if (e.keyCode === 403) { // Red
        setIsSettingsOpen((prev) => !prev);
      } else if (e.keyCode === 404) { // Green
        handleRefresh();
      } else if (e.keyCode === 405) { // Yellow
        handleRotateCycle();
      } else if (e.keyCode === 406) { // Blue
        setIsGuideOpen(true);
      } else if (e.keyCode === 461) { // Back key on LG Magic Remote
        if (isSettingsOpen || isGuideOpen) {
          setIsSettingsOpen(false);
          setIsGuideOpen(false);
        } else {
          setIsSettingsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRotateCycle, handleRefresh, isSettingsOpen, isGuideOpen]);

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* 
        VIEW 1: TV SIMULATOR MODE (For testing and calibration on desktop/laptop)
      */}
      {settings.tvSimulatorMode ? (
        <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden">
          {/* Top Simulator Header */}
          <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Tv className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    webOS Simulator
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                    Modo Retrato 9:16
                  </span>
                </div>
                <h1 className="text-xs text-slate-400 font-medium">
                  Pré-visualização da TV LG instalada verticalmente com Looker Studio
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRotateCycle}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
                title="Girar Orientação da TV"
              >
                <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Rotação: {settings.rotation}°</span>
              </button>

              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                title="Forçar recarregamento de dados agora"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Atualizar</span>
              </button>

              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Guia TV</span>
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-blue-400" />
                <span>Ajustes</span>
              </button>

              <button
                onClick={() => setSettings((prev) => ({ ...prev, tvSimulatorMode: false }))}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
              >
                Ativar Modo TV Direto
              </button>
            </div>
          </div>

          {/* Simulator Workspace */}
          <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden gap-8">
            {/* Virtual LG TV Frame */}
            <div className="relative flex flex-col items-center max-h-full">
              <div
                className="relative bg-slate-900 border-[10px] border-slate-800 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
                style={{
                  width: '390px',
                  height: '693px', // 9:16 aspect ratio
                  maxHeight: 'calc(100vh - 120px)',
                  aspectRatio: '9 / 16',
                }}
              >
                <div className="w-full h-full relative overflow-hidden bg-black">
                  <PortraitViewport settings={settings} isSimulatedTV={true}>
                    <LookerStudioViewer
                      url={settings.url}
                      useEmbedMode={settings.useEmbedMode}
                      refreshTrigger={refreshTrigger}
                    />
                  </PortraitViewport>
                </div>

                {/* Subdued LG webOS logo at bottom */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-[8px] font-bold tracking-widest text-slate-400 font-mono">webOS</span>
                </div>
              </div>

              {/* Base shadow */}
              <div className="w-48 h-3 bg-black/60 blur-md rounded-full mt-2" />
            </div>

            {/* Virtual Magic Remote */}
            <div className="hidden md:flex flex-col items-center">
              <TVRemoteSimulator
                onRotateCycle={handleRotateCycle}
                onRefresh={handleRefresh}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenGuide={() => setIsGuideOpen(true)}
                currentRotation={settings.rotation}
              />
            </div>
          </div>
        </div>
      ) : (
        /* 
          VIEW 2: DIRECT TV KIOSK (Runs directly in the LG webOS browser or installed .ipk)
        */
        <div className="w-full h-full relative overflow-hidden bg-slate-950">
          <PortraitViewport settings={settings} isSimulatedTV={false}>
            <LookerStudioViewer
              url={settings.url}
              useEmbedMode={settings.useEmbedMode}
              refreshTrigger={refreshTrigger}
            />
          </PortraitViewport>

          {/* Heads-Up Remote HUD & Controls */}
          <RemoteControlHUD
            settings={settings}
            secondsUntilRefresh={secondsUntilRefresh}
            onRotateChange={handleRotateChange}
            onRefresh={handleRefresh}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
            onToggleSimulator={() => setSettings((prev) => ({ ...prev, tvSimulatorMode: true }))}
          />
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenGuide={() => setIsGuideOpen(true)}
        onForceRefresh={handleRefresh}
      />

      {/* webOS Deployment Guide Modal */}
      <WebOSGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentRotation={settings.rotation}
      />
    </div>
  );
}

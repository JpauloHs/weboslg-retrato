import React from 'react';
import {
  ChevronUp,
  ChevronDown,
  Power,
  RotateCw,
  RefreshCw,
  HelpCircle,
  Settings,
  KeyRound,
} from 'lucide-react';
import { RotationMode } from '../types';

interface TVRemoteSimulatorProps {
  onRotateCycle: () => void;
  onRefresh: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  currentRotation: RotationMode;
}

export const TVRemoteSimulator: React.FC<TVRemoteSimulatorProps> = ({
  onRotateCycle,
  onRefresh,
  onOpenSettings,
  onOpenGuide,
  currentRotation,
}) => {
  return (
    <div className="w-56 bg-slate-900/95 border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col items-center select-none text-slate-100">
      {/* Remote Top Brand & Power */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider text-slate-400 font-mono">LG webOS</span>
        </div>
        <button
          onClick={onOpenSettings}
          className="w-7 h-7 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Configurações da TV"
        >
          <Power className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Rotation Display Tag */}
      <div className="w-full bg-slate-950 py-1.5 px-2 rounded-lg border border-slate-800 text-center mb-3">
        <span className="text-[10px] font-mono text-blue-400">
          Orientação Atual: <strong className="text-white">{currentRotation}°</strong>
        </span>
      </div>

      {/* LG D-PAD Circle */}
      <div className="relative w-36 h-36 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center shadow-inner my-2">
        {/* Up Button */}
        <button
          onClick={onRotateCycle}
          className="absolute top-1 text-slate-400 hover:text-white p-2 transition-colors cursor-pointer"
          title="Girar Orientação (90° / 270°)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* Down Button */}
        <button
          onClick={onRotateCycle}
          className="absolute bottom-1 text-slate-400 hover:text-white p-2 transition-colors cursor-pointer"
          title="Girar Orientação (90° / 270°)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        {/* Center OK Wheel: Refresh Data */}
        <button
          onClick={onRefresh}
          className="w-14 h-14 rounded-full bg-blue-600/30 hover:bg-blue-600 border border-blue-500/50 flex flex-col items-center justify-center text-white transition-all cursor-pointer shadow-md active:scale-95"
          title="Recarregar Dados do Looker Studio"
        >
          <span className="text-[11px] font-bold font-mono">OK</span>
          <span className="text-[8px] text-blue-200">Reload</span>
        </button>
      </div>

      {/* Auxiliary Navigation: Back, Reload, Guide */}
      <div className="w-full grid grid-cols-3 gap-2 my-3">
        <button
          onClick={onOpenSettings}
          className="py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold rounded-lg flex flex-col items-center gap-1 transition-colors cursor-pointer"
          title="Ajustar Tela"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Ajustar</span>
        </button>

        <button
          onClick={onRefresh}
          className="py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold rounded-lg flex flex-col items-center gap-1 transition-colors cursor-pointer"
          title="Recarregar Dados"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload</span>
        </button>

        <button
          onClick={onOpenGuide}
          className="py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold rounded-lg flex flex-col items-center gap-1 transition-colors cursor-pointer"
          title="Guia de Instalação na TV"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Guia TV</span>
        </button>
      </div>

      {/* webOS LG Color Buttons */}
      <div className="w-full pt-2 border-t border-slate-800/80">
        <div className="text-[9px] font-mono text-slate-500 text-center uppercase tracking-wider mb-2">
          Teclas Coloridas LG
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={onOpenSettings}
            className="h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"
            title="Vermelho: Ajustes"
          />
          <button
            onClick={onRefresh}
            className="h-3 rounded-full bg-emerald-500 hover:bg-emerald-400 transition-colors cursor-pointer"
            title="Verde: Atualizar Dados"
          />
          <button
            onClick={onRotateCycle}
            className="h-3 rounded-full bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer"
            title="Amarelo: Rotação 90°/270°"
          />
          <button
            onClick={onOpenGuide}
            className="h-3 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors cursor-pointer"
            title="Azul: Guia de Instalação"
          />
        </div>
      </div>
    </div>
  );
};

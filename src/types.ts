export type RotationMode = '0' | '90' | '180' | '270';

export interface LookerKioskSettings {
  url: string;
  rotation: RotationMode;
  scale: number; // Zoom level 80% to 130%
  overscanMargin: number; // TV bezel safe area in px (0 - 50)
  autoRefreshMinutes: number; // Auto-reload interval (1, 2, 5, 10, 15, 30 min)
  antiSleepActive: boolean; // Continuous media heartbeat preventing TV 30-min sleep
  showClock: boolean;
  showCountdown: boolean; // Show timer until next refresh
  autoHideControls: boolean;
  autoHideDelaySeconds: number;
  tvSimulatorMode: boolean; // Virtual TV frame for desktop preview
  useEmbedMode: boolean; // Enforce /embed/reporting/ for clean full-screen display
}

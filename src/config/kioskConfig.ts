import { LookerKioskSettings } from '../types';

export const DEFAULT_LOOKER_SETTINGS: LookerKioskSettings = {
  url: 'https://lookerstudio.google.com/embed/reporting/a2db3de4-f866-4b2f-a631-e37bd500e79d/page/p_kdwmpn5sud',
  rotation: '270', // Default 270° or 90° for TV
  scale: 100,
  overscanMargin: 8,
  autoRefreshMinutes: 5, // 5 minutes default for fresh data and active cache-busting
  antiSleepActive: true, // Auto-start keep-awake media loop
  showClock: true,
  showCountdown: true,
  autoHideControls: true,
  autoHideDelaySeconds: 4,
  tvSimulatorMode: false,
  useEmbedMode: true,
};

export const DEFAULT_APP_ID = 'com.looker.portrait.kiosk';
export const DEFAULT_APP_TITLE = 'Looker Studio Retrato';

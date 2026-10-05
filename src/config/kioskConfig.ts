import { LookerKioskSettings } from '../types';

export const DEFAULT_LOOKER_SETTINGS: LookerKioskSettings = {
  url: 'https://lookerstudio.google.com/embed/reporting/a2db3de4-f866-4b2f-a631-e37bd500e79d/page/p_kdwmpn5sud',
  rotation: '90', // Default 90° clockwise for TVs mounted vertically
  scale: 100,
  overscanMargin: 8, // 8px safe margin so TV bezel doesn't clip content
  autoRefreshMinutes: 15, // 15 mins reload to clear WebKit RAM and pull fresh data
  showClock: true,
  autoHideControls: true,
  autoHideDelaySeconds: 4,
  tvSimulatorMode: false,
  useEmbedMode: true,
};

export const DEFAULT_APP_ID = 'com.looker.portrait.kiosk';
export const DEFAULT_APP_TITLE = 'Looker Studio Retrato';

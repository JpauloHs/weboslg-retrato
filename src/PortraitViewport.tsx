import React, { useEffect, useRef } from 'react';
import { LookerKioskSettings, RotationMode } from '../types';

interface PortraitViewportProps {
  settings: LookerKioskSettings;
  children: React.ReactNode;
  isSimulatedTV?: boolean;
}

export const PortraitViewport: React.FC<PortraitViewportProps> = ({
  settings,
  children,
  isSimulatedTV = false,
}) => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Screen Wake Lock (prevents TV standby/sleep if supported by webOS browser)
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch {
        // WakeLock not supported or denied
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, []);

  const { rotation, scale, overscanMargin } = settings;
  const zoomFactor = scale / 100;

  const getTransformStyles = (): React.CSSProperties => {
    if (isSimulatedTV) {
      return {
        width: '100%',
        height: '100%',
        transform: zoomFactor !== 1 ? `scale(${zoomFactor})` : undefined,
        transformOrigin: 'center center',
      };
    }

    if (rotation === '90') {
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100vh',
        height: '100vw',
        transform: `translate(-50%, -50%) rotate(90deg) scale(${zoomFactor})`,
        transformOrigin: 'center center',
      };
    }

    if (rotation === '270') {
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100vh',
        height: '100vw',
        transform: `translate(-50%, -50%) rotate(270deg) scale(${zoomFactor})`,
        transformOrigin: 'center center',
      };
    }

    if (rotation === '180') {
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100vw',
        height: '100vh',
        transform: `translate(-50%, -50%) rotate(180deg) scale(${zoomFactor})`,
        transformOrigin: 'center center',
      };
    }

    // 0° Native Portrait (or when TV is already rotated by system/hardware)
    return {
      position: 'relative',
      width: '100%',
      height: '100%',
      transform: zoomFactor !== 1 ? `scale(${zoomFactor})` : undefined,
      transformOrigin: 'center center',
    };
  };

  return (
    <div
      className="w-full h-full bg-slate-950 overflow-hidden relative flex items-center justify-center select-none"
      style={{
        padding: overscanMargin > 0 ? `${overscanMargin}px` : undefined,
      }}
    >
      {/* Invisible canvas heartbeat to prevent webOS screen off */}
      <canvas
        className="pointer-events-none opacity-0 absolute w-1 h-1"
        width={1}
        height={1}
        aria-hidden="true"
      />

      <div
        style={getTransformStyles()}
        className="overflow-hidden flex flex-col bg-slate-950 w-full h-full"
      >
        {children}
      </div>
    </div>
  );
};

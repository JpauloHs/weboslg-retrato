import React, { useEffect } from 'react';
import { LookerKioskSettings, RotationMode } from '../types';
import { keepAwakeController } from '../utils/keepAwake';

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
  // Start Keep-Awake media heartbeat to prevent webOS TV 30-min screen saver & sleep
  useEffect(() => {
    if (settings.antiSleepActive && !isSimulatedTV) {
      keepAwakeController.start();
    } else {
      keepAwakeController.stop();
    }

    return () => {
      keepAwakeController.stop();
    };
  }, [settings.antiSleepActive, isSimulatedTV]);

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

    // 0° Native Portrait
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
      <div
        style={getTransformStyles()}
        className="overflow-hidden flex flex-col bg-slate-950 w-full h-full"
      >
        {children}
      </div>
    </div>
  );
};

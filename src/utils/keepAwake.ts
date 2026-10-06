/**
 * webOS TV Keep-Awake Engine
 * Prevents LG webOS TVs from triggering screen saver (descanso de tela) or auto-sleep (30 min timer).
 */

class KeepAwakeController {
  private wakeLock: WakeLockSentinel | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private canvasEl: HTMLCanvasElement | null = null;
  private isRunning: boolean = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private audioCtx: AudioContext | null = null;

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // 1. Screen Wake Lock API (supported on newer webOS / Chromium)
    this.requestWakeLock();

    // 2. Continuous HTML5 Video Stream Loop (NoSleep technique)
    // LG webOS will NOT trigger screen saver as long as an active video stream is playing!
    this.initVideoStreamHeartbeat();

    // 3. Web Audio API pulse (signals active media output to webOS)
    this.initAudioHeartbeat();

    // 4. Periodic synthetic user activity simulation
    this.initActivityHeartbeat();

    // Re-acquire on visibility change (when TV switches inputs or wakes)
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  public stop() {
    this.isRunning = false;

    if (this.wakeLock) {
      this.wakeLock.release().catch(() => {});
      this.wakeLock = null;
    }

    if (this.videoEl) {
      this.videoEl.pause();
      this.videoEl.srcObject = null;
      if (this.videoEl.parentNode) {
        this.videoEl.parentNode.removeChild(this.videoEl);
      }
      this.videoEl = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && this.isRunning) {
      this.requestWakeLock();
      if (this.videoEl && this.videoEl.paused) {
        this.videoEl.play().catch(() => {});
      }
    }
  };

  private async requestWakeLock() {
    try {
      if ('wakeLock' in navigator && (!this.wakeLock || this.wakeLock.released)) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          if (this.isRunning) {
            // Re-acquire if released by system
            setTimeout(() => this.requestWakeLock(), 2000);
          }
        });
      }
    } catch (e) {
      // Ignore if unsupported or denied
    }
  }

  private initVideoStreamHeartbeat() {
    try {
      this.canvasEl = document.createElement('canvas');
      this.canvasEl.width = 2;
      this.canvasEl.height = 2;
      const ctx = this.canvasEl.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 2, 2);
      }

      this.videoEl = document.createElement('video');
      this.videoEl.setAttribute('playsinline', '');
      this.videoEl.setAttribute('webkit-playsinline', '');
      this.videoEl.muted = true;
      this.videoEl.loop = true;
      this.videoEl.style.position = 'fixed';
      this.videoEl.style.bottom = '0';
      this.videoEl.style.right = '0';
      this.videoEl.style.width = '1px';
      this.videoEl.style.height = '1px';
      this.videoEl.style.opacity = '0.001';
      this.videoEl.style.pointerEvents = 'none';
      this.videoEl.style.zIndex = '-999';

      // Use canvas capture stream to create live video loop
      if (typeof this.canvasEl.captureStream === 'function') {
        const stream = this.canvasEl.captureStream(2); // 2 fps stream
        this.videoEl.srcObject = stream;
      } else {
        // Fallback: minimal 1-frame silent base64 WebM/MP4
        this.videoEl.src = 'data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYUkoAkEpbQUAZ3ZlcnNpb24D...';
      }

      document.body.appendChild(this.videoEl);

      const playPromise = this.videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry on first user gesture or keydown
          const onUserGesture = () => {
            if (this.videoEl) this.videoEl.play().catch(() => {});
            window.removeEventListener('click', onUserGesture);
            window.removeEventListener('keydown', onUserGesture);
          };
          window.addEventListener('click', onUserGesture);
          window.addEventListener('keydown', onUserGesture);
        });
      }
    } catch (e) {
      // ignore
    }
  }

  private initAudioHeartbeat() {
    // Subtle inaudible audio pulse every 15 seconds to keep webOS media pipeline alive
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    } catch {
      // ignore
    }
  }

  private initActivityHeartbeat() {
    let frame = 0;
    this.heartbeatInterval = setInterval(() => {
      frame++;

      // 1. Subtle draw on canvas to keep video captureStream active
      if (this.canvasEl) {
        const ctx = this.canvasEl.getContext('2d');
        if (ctx) {
          ctx.fillStyle = frame % 2 === 0 ? '#010101' : '#000000';
          ctx.fillRect(0, 0, 2, 2);
        }
      }

      // 2. Ensure video is still playing
      if (this.videoEl && this.videoEl.paused) {
        this.videoEl.play().catch(() => {});
      }

      // 3. Re-verify wake lock every 30s
      if (frame % 3 === 0) {
        this.requestWakeLock();
      }

      // 4. Inaudible audio tick
      try {
        if (this.audioCtx && this.audioCtx.state === 'running') {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          gain.gain.value = 0.0001; // virtually silent
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start();
          osc.stop(this.audioCtx.currentTime + 0.05);
        }
      } catch {
        // ignore
      }

      // 5. Dispatch synthetic micro activity event on window
      try {
        window.dispatchEvent(new Event('keepawake-heartbeat'));
      } catch {
        // ignore
      }
    }, 10000); // Every 10 seconds
  }
}

export const keepAwakeController = new KeepAwakeController();

export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export class CountdownTimer {
  constructor(durationMs, onTick, onComplete) {
    this.remainingMs = durationMs;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.deadline = 0;
    this.intervalId = null;
  }

  get isRunning() {
    return this.intervalId !== null;
  }

  start() {
    if (this.isRunning || this.remainingMs <= 0) return;

    this.deadline = Date.now() + this.remainingMs;
    this.intervalId = window.setInterval(() => this.update(), 200);
    this.update();
  }

  pause() {
    if (!this.isRunning) return;

    this.remainingMs = Math.max(0, this.deadline - Date.now());
    window.clearInterval(this.intervalId);
    this.intervalId = null;
    this.onTick(Math.ceil(this.remainingMs / 1000));
  }

  reset(durationMs) {
    if (this.isRunning) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.remainingMs = durationMs;
    this.onTick(Math.ceil(this.remainingMs / 1000));
  }

  update() {
    this.remainingMs = Math.max(0, this.deadline - Date.now());
    this.onTick(Math.ceil(this.remainingMs / 1000));

    if (this.remainingMs === 0) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      this.onComplete();
    }
  }
}

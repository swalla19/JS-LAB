import { CountdownTimer, formatTime } from './countdown.js';

const clock = document.getElementById('clock');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const status = document.getElementById('status');

function getDurationSeconds() {
  const minutes = Number(minutesInput.value);
  const seconds = Number(secondsInput.value);
  const validMinutes = Number.isInteger(minutes) && minutes >= 0 && minutes <= 99;
  const validSeconds = Number.isInteger(seconds) && seconds >= 0 && seconds <= 59;

  if (!validMinutes || !validSeconds || minutes * 60 + seconds === 0) {
    status.textContent = 'Enter a duration from 00:01 to 99:59.';
    status.classList.add('error');
    return null;
  }

  status.classList.remove('error');
  return minutes * 60 + seconds;
}

function renderTime(totalSeconds) {
  clock.textContent = formatTime(totalSeconds);
}

function updateControls(isRunning) {
  startButton.disabled = isRunning;
  pauseButton.disabled = !isRunning;
  minutesInput.disabled = hasStarted;
  secondsInput.disabled = hasStarted;
}

let hasStarted = false;
let timer = new CountdownTimer(300000, renderTime, () => {
  hasStarted = false;
  updateControls(false);
  status.textContent = 'Time is up. Take a short break!';
});

startButton.addEventListener('click', () => {
  if (!hasStarted) {
    const duration = getDurationSeconds();
    if (duration === null) return;
    timer.reset(duration * 1000);
    hasStarted = true;
    status.textContent = 'Countdown in progress.';
  }

  timer.start();
  updateControls(timer.isRunning);
});

pauseButton.addEventListener('click', () => {
  timer.pause();
  updateControls(false);
  status.textContent = 'Countdown paused. Press Start to resume.';
});

resetButton.addEventListener('click', () => {
  const duration = getDurationSeconds();
  if (duration === null) return;

  timer.reset(duration * 1000);
  hasStarted = false;
  updateControls(false);
  status.textContent = 'Timer reset and ready.';
});

function previewDuration() {
  if (timer.isRunning) return;
  const minutes = Number(minutesInput.value);
  const seconds = Number(secondsInput.value);
  if (
    !hasStarted &&
    Number.isInteger(minutes) && minutes >= 0 && minutes <= 99 &&
    Number.isInteger(seconds) && seconds >= 0 && seconds <= 59
  ) {
    renderTime(minutes * 60 + seconds);
    status.classList.remove('error');
    status.textContent = 'Set a duration, then start the timer.';
  }
}

minutesInput.addEventListener('input', previewDuration);
secondsInput.addEventListener('input', previewDuration);

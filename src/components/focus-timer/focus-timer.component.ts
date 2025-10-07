
import { ChangeDetectionStrategy, Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

@Component({
  selector: 'app-focus-timer',
  templateUrl: './focus-timer.component.html',
  styles: [`
    .progress-ring__circle {
      transition: stroke-dashoffset 0.5s;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FocusTimerComponent implements OnDestroy {
  timerSettings = signal({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  mode = signal<TimerMode>('work');
  timeLeft = signal(this.timerSettings().work * 60);
  isActive = signal(false);
  
  private workSessions = signal(0);
  private timerId: any = null;
  private audio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof Audio !== 'undefined') {
        this.audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
    }
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  startTimer() {
    if (this.isActive()) return;
    this.isActive.set(true);
    this.timerId = setInterval(() => {
      this.timeLeft.update(t => {
        if (t > 0) {
          return t - 1;
        }
        this.timerFinished();
        return 0;
      });
    }, 1000);
  }

  pauseTimer() {
    this.isActive.set(false);
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  resetTimer() {
    this.pauseTimer();
    this.timeLeft.set(this.timerSettings()[this.mode()] * 60);
  }

  setMode(newMode: TimerMode) {
    this.mode.set(newMode);
    this.resetTimer();
  }

  // Fix: Corrected the type of the 'mode' parameter to match TimerMode.
  // The previous type was incorrect, causing a type comparison error.
  updateTimeSetting(mode: TimerMode, event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(value) && value > 0) {
        this.timerSettings.update(settings => ({...settings, [mode]: value}));
        if (this.mode() === mode) {
            this.resetTimer();
        }
    }
  }

  private timerFinished() {
    this.pauseTimer();
    this.audio?.play();

    if (this.mode() === 'work') {
      this.workSessions.update(s => s + 1);
      const nextMode = this.workSessions() % 4 === 0 ? 'longBreak' : 'shortBreak';
      this.setMode(nextMode);
    } else {
      this.setMode('work');
    }
    this.startTimer();
  }

  formatTime = computed(() => {
    const minutes = Math.floor(this.timeLeft() / 60);
    const seconds = this.timeLeft() % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  circumference = 2 * Math.PI * 140;
  progressOffset = computed(() => {
    const totalTime = this.timerSettings()[this.mode()] * 60;
    const progress = totalTime > 0 ? (totalTime - this.timeLeft()) / totalTime : 0;
    return this.circumference * (1 - progress);
  });
}

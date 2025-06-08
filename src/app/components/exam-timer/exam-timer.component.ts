import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { Exam } from '../../models/exam.model';

@Component({
  selector: 'app-exam-timer',
  standalone: true,
  templateUrl: './exam-timer.component.html',
  styleUrls: ['./exam-timer.component.css'],
})
export class ExamTimerComponent implements OnChanges, OnDestroy {
  @Input() currentExam!: Exam;
  @Input() submitAnswers!: () => void;
  timeRemaining: string = '00:00';
  private timerInterval: any;
  private totalSeconds: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentExam'] && this.currentExam?.duration) {
      this.startTimer();
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  startTimer() {
    this.clearTimer();
    this.totalSeconds = (this.currentExam?.duration || 0) * 60;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.totalSeconds--;
      this.updateTimerDisplay();

      if (this.totalSeconds <= 0) {
        this.clearTimer();
        console.log('Exam time has ended!');
        this.handleTimeExpired();
      }
    }, 1000);
  }

  private handleTimeExpired() {
    if (this.submitAnswers && typeof this.submitAnswers === 'function') {
      this.submitAnswers(); // Call the parent's submit function
    } else {
      console.warn('No submit function provided or invalid function');
    }
  }

  private updateTimerDisplay() {
    const minutes = Math.floor(this.totalSeconds / 60);
    const seconds = this.totalSeconds % 60;

    this.timeRemaining = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}

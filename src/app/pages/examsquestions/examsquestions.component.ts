import { Question } from '../../models/question.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamsService } from '../../services/exams.service';
import { Exam } from '../../models/exam.model';
import { ExamTimerComponent } from '../../components/exam-timer/exam-timer.component';

@Component({
  selector: 'app-examsquestions',
  standalone: true,
  imports: [ExamTimerComponent],
  templateUrl: './examsquestions.component.html',
  styleUrls: ['./examsquestions.component.css'],
})
export class ExamsquestionsComponent implements OnInit {
  currentExam!: Exam;
  examId: string = '';
  questions: Question[] = [];
  optionsLetters: string[] = ['A', 'B', 'C', 'D'];
  selectedAnswers: Record<string, number> = {};
  score: number = 0;
  totalDegree: number = 0;
  isLoading: boolean = true;
  isSubmitting: boolean = false;

  constructor(
    private examsService: ExamsService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = this.activateRoute.snapshot.paramMap.get('id') || '';
    this.loadExamData();
  }

  private loadExamData(): void {
    this.examsService.getExamById(this.examId).subscribe({
      next: (response) => {
        this.currentExam = response;
        this.questions = response.questions || [];
        this.calculateTotalDegree();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading exam:', error);
        this.router.navigate(['/exams'], {
          state: { error: 'Failed to load exam' },
        });
      },
    });
  }

  selectAnswer(questionId: string, answerIndex: number): void {
    this.selectedAnswers[questionId] = answerIndex;
  }

  isSelected(questionId: string, optionIndex: number): boolean {
    return this.selectedAnswers[questionId] === optionIndex;
  }

  isFormComplete(): boolean {
    return (
      this.questions.length > 0 &&
      Object.keys(this.selectedAnswers).length === this.questions.length
    );
  }

  handleAutoSubmit = (): void => {
    if (!this.isFormComplete()) {
      console.warn('Auto-submitting incomplete exam');
    }
    this.submitAnswers();
  };

  submitAnswers(event?: Event): void {
    event?.preventDefault();

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    try {
      const answers = this.getAnswersForSubmission();
      this.calculateScore(answers);

      console.log(`Score: ${this.score}/${this.totalDegree}`);

      this.router.navigate(['/scores'], {
        state: {
          score: this.score,
          totalDegree: this.totalDegree,
          examId: this.examId,
          examTitle: this.currentExam?.title || 'Exam Results',
          isAutoSubmitted: !event,
        },
      });
    } catch (error) {
      console.error('Submission error:', error);
      this.isSubmitting = false;
    }
  }

  private calculateTotalDegree(): void {
    this.totalDegree = this.questions.reduce(
      (sum, question) => sum + (question.points || 0),
      0
    );
  }

  private getAnswersForSubmission() {
    return Object.keys(this.selectedAnswers).map((questionId) => ({
      questionId,
      answerIndex: this.selectedAnswers[questionId],
    }));
  }

  private calculateScore(answers: any[]): void {
    answers.map((answer, i) => {
      if (answer.answerIndex == this.questions[i].correctAnswerIndex) {
        this.score += this.questions[i].points;
      }
    });
  }
}

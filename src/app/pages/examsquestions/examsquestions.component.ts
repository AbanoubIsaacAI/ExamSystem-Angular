import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Exam } from '../../models/exam.model';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';
import { Answers } from '../../models/answers.model';
import { Result } from '../../models/results.model';
import {
  SubmittedAnswerPayload,
  ExamSubmitResponse,
} from '../../models/exam-submit.model';

import { ExamsService } from '../../services/exams.service';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { ResultsService } from '../../services/results.service';

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
  currentUser: User | null = null;

  constructor(
    private examsService: ExamsService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService,
    private resultsService: ResultsService
  ) {}

  ngOnInit(): void {
    this.examId = this.activateRoute.snapshot.paramMap.get('id') || '';
    this.loadExamData();
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
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

  async submitAnswers(event?: Event): Promise<void> {
    event?.preventDefault();
    if (this.isSubmitting || !this.currentUser) return;

    this.isSubmitting = true;

    const answers: SubmittedAnswerPayload[] = Object.keys(
      this.selectedAnswers
    ).map((questionId) => ({
      questionId,
      selectedOptionIndex: this.selectedAnswers[questionId],
    }));

    const payload = {
      examId: this.examId,
      answers,
    };

    console.log('Submitting payload:', payload);

    this.examsService.submitExamAnswers(payload).subscribe({
      next: (response: ExamSubmitResponse) => {
        console.log('Backend response:', response);

        this.score = response?.score ?? 0;
        this.totalDegree = response?.total ?? 0;

        const result: Result = {
          student: this.currentUser!,
          exam: this.currentExam!,
          score: this.score,
          total: this.totalDegree,
          passed: response?.passed ?? false,
          answers: response.answers ?? [],
          submittedAt: new Date(),
        };

        this.router.navigate(['/scores'], {
          state: {
            score: this.score,
            totalDegree: this.totalDegree,
            examId: this.examId,
            examTitle: this.currentExam?.title || 'Exam Results',
            isAutoSubmitted: !event,
            answers: response.answers,
          },
        });
      },
      error: (error) => {
        console.error('Submission error:', error);
        alert(
          `Error submitting exam answers: ${error?.message || 'Unknown error'}`
        );
        this.router.navigate(['/exams'], {
          state: { error: 'Failed to submit exam answers' },
        });
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  private calculateTotalDegree(): void {
    this.totalDegree = this.questions.reduce(
      (sum, question) => sum + (question.points || 0),
      0
    );
  }

  private getAnswersForSubmission(): Answers[] {
    return Object.keys(this.selectedAnswers).map((questionId) => {
      const selectedIndex = this.selectedAnswers[questionId];
      const question = this.questions.find((q) => q._id === questionId);
      const isCorrect =
        question && question.correctAnswerIndex !== undefined
          ? Number(selectedIndex) === Number(question.correctAnswerIndex)
          : false;

      return {
        questionId,
        selectedIndex,
        isCorrect,
      };
    });
  }
}

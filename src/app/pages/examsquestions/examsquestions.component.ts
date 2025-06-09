import { UsersService } from './../../services/users.service';
import { AuthService } from './../../services/auth.service';
import { Question } from '../../models/question.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamsService } from '../../services/exams.service';
import { Exam } from '../../models/exam.model';
import { ExamTimerComponent } from '../../components/exam-timer/exam-timer.component';
import { User } from '../../models/user.model';
import { Answers } from '../../models/answers.model';
import { Result } from '../../models/results.model';

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
    private router: Router,
    private AuthService: AuthService,
    private UsersService: UsersService
  ) {}

  ngOnInit(): void {
    this.examId = this.activateRoute.snapshot.paramMap.get('id') || '';
    this.loadExamData();
    this.AuthService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }
  currentUser: User | null = null;

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

  updateUserProfile() {
    if (!this.currentUser) return;

    const newResult: Result = {
      studentID: this.currentUser.id,
      examID: this.examId,
      examTitle: this.currentExam.title,
      score: this.score,
      total: this.totalDegree,
      passed: this.score >= this.currentExam.passingScore,
      answers: this.getAnswersForSubmission(),
      submittedAt: new Date(),
    };

    const updatedUser: User = {
      ...this.currentUser,
      result: [...(this.currentUser.result || []), newResult],
    };

    this.UsersService.updateUser(this.currentUser.id, updatedUser).subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.error('Failed to update user with result:', err);
      },
    });
  }

  submitAnswers(event?: Event): void {
    event?.preventDefault();

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    try {
      const answers = this.getAnswersForSubmission();
      this.calculateScore(answers);

      console.log(`Score: ${this.score}/${this.totalDegree}`);
      this.updateUserProfile();
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

  private getAnswersForSubmission(): Answers[] {
    return Object.keys(this.selectedAnswers).map((questionId) => ({
      questionId,
      selectedIndex: this.selectedAnswers[questionId],
    }));
  }

  private calculateScore(answers: Answers[]): void {
    answers.map((answer, i) => {
      if (
        Number(answer.selectedIndex) ===
        Number(this.questions[i].correctAnswerIndex)
      ) {
        this.score += this.questions[i].points;
      }
    });
  }
}

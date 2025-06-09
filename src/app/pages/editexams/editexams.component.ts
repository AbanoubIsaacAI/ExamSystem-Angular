import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamsService } from '../../services/exams.service';
import { Exam } from '../../models/exam.model';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-editexams',
  imports: [ReactiveFormsModule],
  templateUrl: './editexams.component.html',
  styleUrl: './editexams.component.css',
})
export class EditexamsComponent implements OnInit {
  examID: string = '';
  currentExam!: Exam;
  questions: Question[] = [];
  examForm!: FormGroup;

  constructor(
    private ExamsService: ExamsService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.examID = this.ActivatedRoute.snapshot.paramMap.get('id') || '';

    this.ExamsService.getExamById(this.examID).subscribe({
      next: (response) => {
        this.currentExam = response;
        this.questions = response.questions || [];

        this.initializeForm();

        this.examForm
          .get('questionsNumber')
          ?.valueChanges.subscribe((value) => {
            const number = +value;
            const currentLength = this.questionsFormArray.length;

            if (number > currentLength) {
              for (let i = currentLength; i < number; i++) {
                this.addQuestion();
              }
            } else if (number < currentLength) {
              for (let i = currentLength - 1; i >= number; i--) {
                this.questionsFormArray.removeAt(i);
              }
            }
          });
      },
      error: (error) => {
        console.error('Error loading exam:', error);
        this.router.navigate(['/exams'], {
          state: { error: 'Failed to load exam' },
        });
      },
    });
  }

  initializeForm() {
    const questionFormGroups = this.questions.map(
      (q) =>
        new FormGroup({
          questionText: new FormControl(q.questionText, Validators.required),
          options: new FormArray(
            (q.options ?? []).map(
              (opt) => new FormControl(opt, Validators.required)
            )
          ),
          correctAnswerIndex: new FormControl(
            q.correctAnswerIndex,
            Validators.required
          ),
          points: new FormControl(q.points, Validators.required),
        })
    );

    this.examForm = new FormGroup({
      id: new FormControl(this.currentExam.id),
      title: new FormControl(this.currentExam.title, Validators.required),
      description: new FormControl(this.currentExam.description),
      duration: new FormControl(this.currentExam.duration, [
        Validators.required,
        Validators.min(1),
      ]),
      passingScore: new FormControl(this.currentExam.passingScore, [
        Validators.required,
        Validators.min(1),
      ]),
      questionsNumber: new FormControl(this.questions.length, [
        Validators.required,
        Validators.min(1),
      ]),
      questions: new FormArray(questionFormGroups),
    });
  }

  get questionsFormArray(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  getOptionsFormArray(questionIndex: number): FormArray {
    return this.questionsFormArray
      .at(questionIndex)
      .get('options') as FormArray;
  }

  addQuestion() {
    const optionsArray = new FormArray([
      new FormControl('', Validators.required),
      new FormControl('', Validators.required),
      new FormControl('', Validators.required),
      new FormControl('', Validators.required),
    ]);

    this.questionsFormArray.push(
      new FormGroup({
        questionText: new FormControl('', Validators.required),
        options: optionsArray,
        correctAnswerIndex: new FormControl(0, Validators.required),
        points: new FormControl(10, Validators.required),
      })
    );
  }

  removeQuestion(index: number) {
    this.questionsFormArray.removeAt(index);
  }

  submitExam() {
    if (this.examForm.valid) {
      const formValue = this.examForm.value;

      const updatedExam: Exam = {
        id: formValue.id!,
        title: formValue.title!,
        description: formValue.description!,
        duration: formValue.duration!,
        passingScore: formValue.passingScore!,
        questions: formValue.questions!,
        createdAt: this.currentExam.createdAt,
      };

      this.ExamsService.updateExam(updatedExam).subscribe({
        next: () => {
          console.log('Exam updated successfully');
          this.router.navigate(['/exams']);
        },
        error: (err) => {
          console.error('Failed to update exam:', err);
        },
      });
    } else {
      console.warn('Form is invalid');
      this.examForm.markAllAsTouched();
    }
  }
}

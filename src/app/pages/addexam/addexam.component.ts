import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExamsService } from '../../services/exams.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-addexam',
  imports: [ReactiveFormsModule],
  templateUrl: './addexam.component.html',
  styleUrl: './addexam.component.css',
})
export class AddexamComponent implements OnInit {
  constructor(private ExamsService: ExamsService, private router: Router) {}

  ngOnInit(): void {
    this.examForm.get('questionsNumber')?.valueChanges.subscribe((value) => {
      if (value != null) {
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
      }
    });
  }

  examForm = new FormGroup({
    _id: new FormControl(''),
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    duration: new FormControl(0, [Validators.required, Validators.min(1)]),
    passingScore: new FormControl(0, [Validators.required, Validators.min(1)]),
    questionsNumber: new FormControl(0, [
      Validators.required,
      Validators.min(1),
    ]),

    questions: new FormArray([]),
  });

  get questionsFormArray() {
    return this.examForm.get('questions') as FormArray;
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

  getOptionsFormArray(questionIndex: number): FormArray {
    return this.questionsFormArray
      .at(questionIndex)
      .get('options') as FormArray;
  }

  removeQuestion(i: number) {
    this.questionsFormArray.removeAt(i);
  }
  submitExam() {
    if (this.examForm.valid) {
      const ExamValues = this.examForm.value;
      const newExam = {
        _id: ExamValues._id!,
        title: ExamValues.title!,
        description: ExamValues.description!,
        duration: ExamValues.duration!,
        passingScore: ExamValues.passingScore!,
        questions: ExamValues.questions!,
        createdAt: new Date(),
      };

      this.ExamsService.addExam(newExam).subscribe({
        next: () => {
          console.log('Exam added successfully');
          this.router.navigate(['/exams']);
        },
        error: (err) => {
          console.error('Failed to add exam:', err);
        },
      });
    } else {
      console.warn('Form is invalid');
      this.examForm.markAllAsTouched();
    }
  }
}

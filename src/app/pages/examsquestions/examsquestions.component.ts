import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamsService } from '../../services/exams.service';
import { Exam } from '../../models/exam.model';

@Component({
  selector: 'app-examsquestions',
  imports: [],
  templateUrl: './examsquestions.component.html',
  styleUrl: './examsquestions.component.css',
})
export class ExamsquestionsComponent implements OnInit {
  constructor(
    private examsService: ExamsService,
    private activateRoute: ActivatedRoute
  ) {}
  currentExam!: Exam;
  examId!: any;
  questions!: any;
  optionsLetters: string[] = ['a', 'b', 'c', 'd'];
  ngOnInit(): void {
    this.examId = this.activateRoute.snapshot.paramMap.get('id');
    this.examsService.getExamById(this.examId).subscribe({
      next: (response) => (this.questions = response.questions),
      error: (error) => console.log(error),
    });
  }
  selectedAnswer!: number;
  selectAnswer(questionID: string, i: number) {
    this.selectedAnswer = i;
  }
}

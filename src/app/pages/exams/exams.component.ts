import { Component, OnInit, Pipe } from '@angular/core';
import { ExamsService } from '../../services/exams.service';
import { Exam } from '../../models/exam.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-exams',
  imports: [DatePipe, RouterLink],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent implements OnInit {
  examsList!: Exam[];
  constructor(private examsService: ExamsService) {}
  ngOnInit(): void {
    this.examsService.getAllexams().subscribe({
      next: (response) => (this.examsList = response),
      error: (error) => console.log(error),
    });
  }
}

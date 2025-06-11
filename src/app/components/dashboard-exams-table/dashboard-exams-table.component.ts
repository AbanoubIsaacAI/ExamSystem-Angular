import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ExamsService } from '../../services/exams.service';
import { Exam } from '../../models/exam.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-exams-table',
  imports: [],
  templateUrl: './dashboard-exams-table.component.html',
  styleUrl: './dashboard-exams-table.component.css',
})
export class DashboardExamsTableComponent implements OnInit, OnChanges {
  allExams: Exam[] = [];
  filteredExams: Exam[] = [];
  @Input() filter: string = '';

  constructor(private examsService: ExamsService, private router: Router) {}

  ngOnInit(): void {
    this.examsService.getAllexams().subscribe((data) => {
      this.allExams = data;
      this.applyFilter();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.applyFilter();
    }
  }
  applyFilter(): void {
    const lowerFilter = this.filter.toLowerCase();
    this.filteredExams = this.allExams.filter((exam) =>
      exam.title.toLowerCase().includes(lowerFilter)
    );
  }

  deleteExam(id: string): void {
    this.examsService.deleteExam(id).subscribe(() => {
      this.allExams = this.allExams.filter((exam) => exam._id !== id);
      this.applyFilter();
    });
  }
  editexam(id: string) {
    this.router.navigate([`/editexam/${id}`]);
  }
}

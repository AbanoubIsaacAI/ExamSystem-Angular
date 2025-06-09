import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ExamsService } from '../../services/exams.service';
import { Exam } from '../../models/exam.model';

@Component({
  selector: 'app-dashboard-exams-table',
  imports: [],
  templateUrl: './dashboard-exams-table.component.html',
  styleUrl: './dashboard-exams-table.component.css',
})
export class DashboardExamsTableComponent implements OnInit, OnChanges {
  // examsList: any[] = [];
  allExams: Exam[] = [];
  filteredExams: Exam[] = [];
  @Input() filter: string = '';

  constructor(private examsService: ExamsService) {}

  // display all exams
  ngOnInit(): void {
    this.examsService.getAllexams().subscribe((data) => {
      // this.examsList = data;
      this.allExams = data;
      this.applyFilter();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.applyFilter();
    }
  }
  // filter by exam title
  applyFilter(): void {
    const lowerFilter = this.filter.toLowerCase();
    this.filteredExams = this.allExams.filter((exam) =>
      exam.title.toLowerCase().includes(lowerFilter)
    );
  }

  deleteExam(id: string): void {
    this.examsService.deleteExam(id).subscribe(() => {
      this.allExams = this.allExams.filter((exam) => exam.id !== id);
      this.applyFilter(); 
    });
  }
}

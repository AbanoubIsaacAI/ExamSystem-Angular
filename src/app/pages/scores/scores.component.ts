import { Component, OnInit } from '@angular/core';
import { Result } from '../../models/results.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ResultsService } from '../../services/results.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-scores',
  standalone: true,
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css'],
  imports: [DatePipe],
})
export class ScoresComponent implements OnInit {
  currentUser: User | null = null;
  results: Result[] = []; // For students
  allResults: Result[] = []; // For admin

  constructor(
    private authService: AuthService,
    private resultsService: ResultsService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      if (user?.role === 'admin') {
        this.resultsService.getAllresults().subscribe((res) => {
          this.allResults = res;
        });
      } else {
        this.resultsService.getStudentresults().subscribe((res) => {
          this.results = res;
        });
      }
    });
  }
}

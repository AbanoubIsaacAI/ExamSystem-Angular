import { ResultsService } from './../../services/results.service';
import { UsersService } from './../../services/users.service';
import { DatePipe } from '@angular/common';
import { Result } from '../../models/results.model';
import { User } from './../../models/user.model';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scores',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css',
})
export class ScoresComponent implements OnInit {
  currentUser: User | null = null;
  results: (Result & { userId?: string })[] = [];
  studentUsers: User[] = [];
  isLoading = false;
  error: string | null = null;
  private studentNameCache: { [id: string]: string } = {};

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private resultsService: ResultsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;
    this.studentNameCache = {}; // Clear cache on reload

    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;

        if (this.currentUser?.role === 'student') {
          this.results = this.currentUser.result || [];
          this.isLoading = false;
        } else if (this.currentUser?.role === 'admin') {
          this.usersService.getAllUsers().subscribe({
            next: (users: User[]) => {
              this.studentUsers = users;
              this.results = users.flatMap((user) =>
                user.result
                  ? user.result.map((r) => ({ ...r, userId: user.id }))
                  : []
              );
              this.isLoading = false;
            },
            error: (err) => {
              this.error = 'Failed to load user results';
              this.isLoading = false;
              console.error(err);
            },
          });
        }
      },
      error: (err) => {
        this.error = 'Failed to load user data';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  getStudentName(userId: string): string {
    if (!userId) return 'Unknown Student';
    if (this.studentNameCache[userId]) return this.studentNameCache[userId];

    const user = this.studentUsers.find((u) => u.id === userId);
    const name = user ? user.username : 'Unknown Student';
    this.studentNameCache[userId] = name;
    return name;
  }
}

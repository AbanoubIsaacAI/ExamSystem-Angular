import { DatePipe } from '@angular/common';
import { Result } from '../../models/results.model';
import { User } from './../../models/user.model';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scores',
  imports: [DatePipe],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css',
})
export class ScoresComponent implements OnInit {
  constructor(private AuthService: AuthService) {}
  ngOnInit(): void {
    this.AuthService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.results = this.currentUser?.result || [];
    });
  }
  currentUser: User | null = null;
  results: Result[] = [];
}

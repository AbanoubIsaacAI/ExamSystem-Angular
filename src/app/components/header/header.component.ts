import { AuthService } from './../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  constructor(private AuthService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.AuthService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }
  currentUser: User | null = null;
  fixedNav: boolean = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.fixedNav = window.scrollY > 100;
  }

  logout() {
    this.AuthService.logout();
    this.router.navigate(['/home']);
  }
}

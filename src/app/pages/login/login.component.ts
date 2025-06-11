import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    identifier: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  isValidLogin: boolean = true;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    if (this.loginForm.invalid) return;

    const { identifier, password } = this.loginForm.value;

    this.authService
      .login({ email: identifier!, password: password! })
      .subscribe({
        next: (response: any) => {
          const userWithToken = { ...response.user, token: response.token };
          this.authService.setCurrentUser(userWithToken);
          this.router.navigate(['/home']);
        },
        error: () => {
          this.errorMessage = 'Invalid login';
        },
      });
  }
}

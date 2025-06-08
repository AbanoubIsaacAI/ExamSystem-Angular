import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private UsersService: UsersService,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.UsersService.getAllUsers().subscribe({
      next: (response: User[]) => {
        this.allUsers = response;
        console.log(this.allUsers);
      },
    });
  }
  allUsers: User[] = [];

  loginForm = new FormGroup({
    identifier: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  isValidLogin: boolean = false;
  login() {
    const formValues = this.loginForm.value;
    const input = formValues.identifier;
    const password = formValues.password;

    const matchedUser = this.allUsers.find(
      (user) =>
        (user.email === input || user.username === input) &&
        user.password === password
    );
    if (!matchedUser) {
      alert('invaild login');
      return;
    }
    this.authService.login(matchedUser);
    this.router.navigate(['/home']);
  }
}

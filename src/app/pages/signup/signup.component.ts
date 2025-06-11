import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class SignupComponent implements OnInit {
  allUsers: User[] = [];
  doesEmailExist: boolean = false;

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
    ]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Optional: if your backend already checks for existing email, you can skip this
  }

  getName() {
    return this.registrationForm.controls['name'];
  }
  getEmail() {
    return this.registrationForm.controls['email'];
  }
  getPassword() {
    return this.registrationForm.controls['password'];
  }

  Register(e: Event) {
    e.preventDefault();
    if (this.registrationForm.invalid) {
      alert('Please fix the errors before submitting.');
      return;
    }

    const formValues = this.registrationForm.value;
    const newUser: User = {
      id: uuidv4(), // You might omit this if backend auto-generates ID
      username: formValues.name ?? '',
      email: formValues.email ?? '',
      password: formValues.password ?? '',
      role: 'student',
    };

    this.authService.register(newUser).subscribe({
      next: (response: any) => {
        console.log('User registered:', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');
      },
    });
  }
}

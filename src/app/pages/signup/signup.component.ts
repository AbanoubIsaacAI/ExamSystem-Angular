import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  constructor(private UsersService: UsersService, private router: Router) {}
  ngOnInit(): void {
    this.UsersService.getAllUsers().subscribe({
      next: (response: User[]) => {
        this.allUsers = response;
        console.log(this.allUsers);
      },
    });
  }

  allUsers!: User[];

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

  getName() {
    return this.registrationForm.controls['name'];
  }
  getEmail() {
    return this.registrationForm.controls['email'];
  }
  getPassword() {
    return this.registrationForm.controls['password'];
  }
  doesEmailExist: boolean = false;
  addUser() {
    if (this.registrationForm.invalid) {
      alert('Please fix the errors before submitting.');
      return;
    }

    const formValues = this.registrationForm.value;

    this.doesEmailExist = this.allUsers.some(
      (user) => user.email === formValues.email
    );

    if (this.doesEmailExist) {
      return;
    }
    const newUser: User = {
      id: uuidv4(),
      username: formValues.name ?? '',
      email: formValues.email ?? '',
      password: formValues.password ?? '',
      role: 'student',
    };

    this.UsersService.AddNewUser(newUser).subscribe({
      next: (createdUser: User) => {
        console.log('User created:', createdUser);
      },
      error: (err) => {
        console.error('Error creating user:', err);
      },
    });
    this.router.navigate(['/login']);
  }

  Register(e: Event) {
    e.preventDefault();
    if (this.registrationForm.status == 'VALID') {
      this.addUser();
    } else {
      alert('Fix the errors');
    }
  }
}

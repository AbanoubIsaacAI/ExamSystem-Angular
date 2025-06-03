import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
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

  Register(e: Event) {
    e.preventDefault();
    if (this.registrationForm.status == 'VALID') {
      console.log('the form is valid');
    } else {
      alert('Fix the errors');
    }
  }
}

import {Component, output} from '@angular/core';
import {InputComponent} from '../../common-ui/input/input.component';
import {ButtonComponent} from '../../common-ui/button/button.component';
import {AuthService} from '../../../core/services/auth.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {passwordValidator} from '../../../core/helpers/validators/passwordValidator';

@Component({
  selector: 'app-register-modal',
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss'
})

export class RegisterModalComponent {
  registrationForm: FormGroup;
  errorMessage = '';

  close = output<void>();
  switchToLogin = output<void>();

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required, Validators.minLength(3)],
      password: ['', [Validators.required, passwordValidator]],
      repeatPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      return;
    }

    const { email, username, password, repeatPassword } = this.registrationForm.value;
    if (password !== repeatPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register({ email, username, password }).subscribe({
      next: () => {
        this.errorMessage = '';
        this.close.emit();
      },
      error: (err) => this.errorMessage = err.error.message || 'Registration failed'
    });
  }

  closeModal() {
    this.close.emit();
  }
}

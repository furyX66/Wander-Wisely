import {Component, inject, OnInit, output} from '@angular/core';
import {ButtonComponent} from "../../common-ui/button/button.component";
import {InputComponent} from "../../common-ui/input/input.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-modal',
  imports: [
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
  standalone: true,
})
export class LoginModalComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  loginForm!: FormGroup;
  errorMessage = '';

  close = output<void>();
  switchToRegister = output<void>();
  switchToEmailInput = output<void>();

  ngOnInit() {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill all fields.';
      return;
    }
    const { emailOrUsername, password } = this.loginForm.value;
    this.authService.login({ emailOrUsername, password }).subscribe({
      next: () => {
        this.errorMessage = '';
        this.close.emit();
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }
  closeModal() {
    this.close.emit();
  }
}

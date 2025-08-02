import {Component, inject, output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputComponent} from '../../../common-ui/input/input.component';
import {ButtonComponent} from '../../../common-ui/button/button.component';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-email-input',
  imports: [
    FormsModule,
    InputComponent,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './email-input-modal.component.html',
  styleUrl: './email-input-modal.component.scss'
})
export class EmailInputModalComponent {
  private authService = inject(AuthService);
  emailInputForm: FormGroup;
  codeSuccess = output<{ email: string, code: string }>();

  close = output<void>();

  constructor(private fb: FormBuilder) {
    this.emailInputForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.emailInputForm.invalid) {
      return;
    }

    const email = this.emailInputForm.value.email.trim().toLowerCase();

    this.authService.forgotPassword(email).subscribe({
      next: (response: string) => {
        if (response === 'User does not exist.') {
          console.error(response);
        } else {
          console.log('Reset code sent:', response);
          this.codeSuccess.emit({ email, code: response });
          this.emailInputForm.reset();
        }
      },
      error: (error) => {
        console.error('Error during forgot password request:', error);
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}

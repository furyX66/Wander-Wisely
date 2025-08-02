import {Component, computed, inject, input, output} from '@angular/core';
import {ButtonComponent} from '../../../common-ui/button/button.component';
import {InputComponent} from '../../../common-ui/input/input.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services/auth.service';
import {passwordValidator} from '../../../../core/helpers/validators/passwordValidator';

@Component({
  selector: 'app-new-password',
  imports: [
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {
  private authService = inject(AuthService);
  newPasswordForm: FormGroup;
  data = input<{email:string; code:string}>();
  close = output<void>();
  email = computed(() => this.data()?.email || '');
  code = computed(() => this.data()?.code || '');

  constructor(private fb: FormBuilder) {
    this.newPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, passwordValidator]],
      repeatNewPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.newPasswordForm.invalid) {
      return;
    }

    console.log("Code", this.code())

    const { newPassword, repeatNewPassword } = this.newPasswordForm.value;

    if (newPassword !== repeatNewPassword) {
      return;
    }

    this.authService.resetPassword(this.email(), this.code(), this.newPasswordForm.value.newPassword,).subscribe({
      next: (response: string) => {
        if (!response) {
          console.error("Password reset error",response);
        }
        else {
          console.log('Password reset error success:', response);
          this.close.emit();
          this.newPasswordForm.reset();
        }
      },
      error: (error) => {
        console.error('Error during password reset error request:', error);
      }
    });
  }
}

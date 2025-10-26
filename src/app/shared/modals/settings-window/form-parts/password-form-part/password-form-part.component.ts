import {Component, inject, OnInit} from '@angular/core';
import {ButtonComponent} from "../../../../common-ui/button/button.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputComponent} from "../../../../common-ui/input/input.component";
import {UserService} from '../../../../../core/services/user.service';

@Component({
  selector: 'app-password-form-part',
    imports: [
        ButtonComponent,
        FormsModule,
        InputComponent,
        ReactiveFormsModule
    ],
  templateUrl: './password-form-part.component.html',
  styleUrl: './password-form-part.component.scss'
})
export class PasswordFormPartComponent implements OnInit {
  private userService = inject(UserService);
  passwordForm!: FormGroup;
  successMessage='';
  errorMessage = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.passwordForm = this.fb.group({
      currentPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
      repeatPassword: ["", Validators.required],
    })
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.passwordForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly';
      return;
    }

    const { currentPassword, newPassword, repeatPassword } = this.passwordForm.value;

    if (newPassword !== repeatPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.userService.changePassword({
      currentPassword,
      newPassword
    }).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully';
        this.passwordForm.reset();
      },
      error: err => {
        console.log(err);
        this.errorMessage = err.error || 'Error updating password';
      }
    });
  }
}

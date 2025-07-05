import {Component, OnInit, output} from '@angular/core';
import {ProfileIcon} from '../../../../../public/assets/icons/profile-icon';
import {InputComponent} from '../../common-ui/input/input.component';
import {ButtonComponent} from '../../common-ui/button/button.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../core/services/user.service';

@Component({
  selector: 'app-settings-window',
  imports: [
    ProfileIcon,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './settings-window.component.html',
  styleUrl: './settings-window.component.scss',
  standalone: true,
})
export class SettingsWindowComponent implements OnInit {
  close = output<void>();
  personalInfoForm!: FormGroup;
  passwordForm!: FormGroup;
  userInfoSuccessMessage = '';
  userInfoErrorMessage = '';
  passwordSuccessMessage='';
  passwordErrorMessage = '';
  userId!: number;
  oldUser: any;

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.oldUser = user;
      this.userId = user.id;
      this.personalInfoForm = this.fb.group({
        username: [user.username],
        email: [user.email],
      });
    });
    this.passwordForm = this.fb.group({
      currentPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
      repeatPassword: ["", Validators.required],
    })
  }

  onPersonalInfoFormSubmit() {
    this.userInfoSuccessMessage = '';
    this.userInfoErrorMessage = '';
    if (this.personalInfoForm.valid) {
      const patch = this.createPatch();

      if (patch.length > 0) {
        this.userService.updateUser(this.userId, patch).subscribe({
          next: updatedUser => {
            this.userInfoSuccessMessage = 'User updated successfully';
            console.log('User updated successfully:', updatedUser);
            this.oldUser = updatedUser;
          },
          error: error => {
            this.userInfoErrorMessage = 'Error updating user';
            console.error('Error updating user', error);
          }
        });
      }
    }
  }

  onPasswordFormSubmit() {
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';

    if (this.passwordForm.invalid) {
      this.passwordSuccessMessage = 'Please fill all fields correctly';
      return;
    }

    const { currentPassword, newPassword, repeatPassword } = this.passwordForm.value;

    if (newPassword !== repeatPassword) {
      this.passwordErrorMessage = 'Passwords do not match';
      return;
    }

    this.userService.changePassword({
      currentPassword,
      newPassword
    }).subscribe({
      next: () => {
        this.passwordSuccessMessage = 'Password changed successfully';
        this.passwordForm.reset();
      },
      error: err => {
        this.passwordErrorMessage = err.error?.message || 'Error updating password';
      }
    });
  }

  private createPatch(): any[] {
    const patch: any[] = [];
    const formValue = this.personalInfoForm.value;

    if (formValue.username !== this.oldUser.username) {
      patch.push({
        op: 'replace',
        path: '/username',
        value: formValue.username
      });
    }

    if (formValue.email !== this.oldUser.email) {
      patch.push({
        op: 'replace',
        path: '/email',
        value: formValue.email
      });
    }

    return patch;
  }

  closeModal() {
    this.close.emit();
  }
}

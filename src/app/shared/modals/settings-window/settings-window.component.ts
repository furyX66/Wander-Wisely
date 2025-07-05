import {Component, OnInit, output} from '@angular/core';
import {ProfileIcon} from '../../../../../public/assets/icons/profile-icon';
import {InputComponent} from '../../common-ui/input/input.component';
import {ButtonComponent} from '../../common-ui/button/button.component';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
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
  successMessage = '';
  errorMessage = '';
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
  }

  onPersonalInfoFormSubmit() {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.personalInfoForm.valid) {
      const patch = this.createPatch();

      if (patch.length > 0) {
        this.userService.updateUser(this.userId, patch).subscribe({
          next: updatedUser => {
            this.successMessage = 'User updated successfully';
            console.log('User updated successfully:', updatedUser);
            this.oldUser = updatedUser;
          },
          error: error => {
            this.errorMessage = 'Error updating user';
            console.error('Error updating user', error);
          }
        });
      }
    }
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

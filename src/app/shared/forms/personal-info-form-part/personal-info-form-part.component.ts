import {Component, OnInit} from '@angular/core';
import {ButtonComponent} from "../../common-ui/button/button.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputComponent} from "../../common-ui/input/input.component";
import {UserService} from '../../../core/services/user.service';

@Component({
  selector: 'app-personal-info-form-part',
    imports: [
        ButtonComponent,
        FormsModule,
        InputComponent,
        ReactiveFormsModule
    ],
  templateUrl: './personal-info-form-part.component.html',
  styleUrl: './personal-info-form-part.component.scss'
})
export class PersonalInfoFormPartComponent implements OnInit {
  userId!: number;
  oldUser: any;
  personalInfoForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

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

  onSubmit() {
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
}

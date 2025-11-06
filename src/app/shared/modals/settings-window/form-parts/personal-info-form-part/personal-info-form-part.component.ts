import {Component, inject, OnInit} from '@angular/core';
import {ButtonComponent} from "../../../../common-ui/button/button.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputComponent} from "../../../../common-ui/input/input.component";
import {UserService} from '../../../../../core/services/user.service';
import {IUser} from '../../../../../../interfaces/IUser';
import {Subject, takeUntil} from 'rxjs';

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
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  userId!: number;
  oldUser: any;
  personalInfoForm!: FormGroup;
  private destroy$ = new Subject<void>();
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        {
          next: (user) => {
            this.oldUser = user;
            this.userId = user.userId;
            this.personalInfoForm = this.fb.group({
              username: [user.username],
              email: [user.email, Validators.email],
            });
          },
          error: (err) => {
            console.error('Failed to load user:', err);
          }
        });
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.personalInfoForm.valid) {
      const patch = this.createPatch();

      if (patch.length > 0) {
        this.userService.updateUser(this.userId, patch).subscribe({
          next: (updatedUser: IUser) => {
            this.userService.currentUserSubject.next(updatedUser);
            this.successMessage = 'IUser updated successfully';
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

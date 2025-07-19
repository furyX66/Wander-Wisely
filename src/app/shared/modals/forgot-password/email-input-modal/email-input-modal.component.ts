import {Component, output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputComponent} from '../../../common-ui/input/input.component';
import {ButtonComponent} from '../../../common-ui/button/button.component';

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
  emailInputForm: FormGroup;

  close = output<void>();

  constructor(
    private fb: FormBuilder,
  ) {
    this.emailInputForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    console.log("Email:", this.emailInputForm.value.email);
  }

  closeModal() {
    this.close.emit();
  }
}

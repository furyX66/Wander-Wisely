import {Component, computed, inject, input, OnInit, output} from '@angular/core';
import {ButtonComponent} from "../../../common-ui/button/button.component";
import {InputComponent} from "../../../common-ui/input/input.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from '../../../../core/services/auth.service';
import {ModalType} from '../../../../../enums/ModalType';
import {ModalService} from '../../../../core/services/modal.service';

@Component({
  selector: 'app-verification-code-input',
  imports: [
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './verification-code-input.component.html',
  styleUrl: './verification-code-input.component.scss'
})
export class VerificationCodeInputComponent implements OnInit {
  errorMessage = "";
  private modalService = inject(ModalService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  verifyResetCodeForm!: FormGroup;
  codeVerified = output<{ email: string, code: string }>();
  data = input<{email:string; code:string}>();
  email = computed(() => this.data()?.email || '');

  close = output<void>();

  ngOnInit(): void {
    this.verifyResetCodeForm = this.fb.group({
      code: ['', Validators.required],
    });
  }

  handleClose(): void {
    this.modalService.openModal(ModalType.CLOSE_MODAL);
  }

  onSubmit() {
    this.verifyResetCodeForm.controls["code"].markAsTouched();
    this.errorMessage = "";
    if (this.verifyResetCodeForm.invalid) {
      return;
    }

    this.authService.verifyResetCode(this.email(), this.verifyResetCodeForm.value.code).subscribe({
      next: (response: string) => {
        if (!response) {
          console.error("Verification code error",response);
        }
        else {
          console.log('Verification code success:', response);
          this.codeVerified.emit({ email: this.email(), code: this.verifyResetCodeForm.value.code });
          this.verifyResetCodeForm.reset();
        }
      },
      error: (error) => {
        this.errorMessage = error.error.message;
        console.error('Error during verify code request:', error);
      }
    });
  }
}

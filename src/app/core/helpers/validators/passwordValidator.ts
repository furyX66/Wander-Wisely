import {AbstractControl} from '@angular/forms';

const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
export function passwordValidator(control: AbstractControl) {
  if (!control.value) return null;
  return passwordPattern.test(control.value)
    ? null
    : { invalidPassword: true };
}

import {Component, forwardRef, input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  imports: [
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  type = input<string>('text');
  placeholder = input<string>('');
  name = input<string>('');
  required = input<boolean>(false);
  autocomplete = input<string>('');

  internalValue: string = '';
  showPassword: boolean = false;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    this.internalValue = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.internalValue = value;
    this.onChange(value);
    this.onTouched();
  }
}

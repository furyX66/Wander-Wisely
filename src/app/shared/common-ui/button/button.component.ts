import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  variant = input<string>('');
  type = input<"button" | "submit" | "reset">('button');

  btnClick = output<Event>();

  onClick(event: Event) {
    this.btnClick.emit(event);
  }
}

import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() className: string = 'btn';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() btnClick = new EventEmitter<Event>();

  onClick(event: Event) {
    this.btnClick.emit(event);
  }
}

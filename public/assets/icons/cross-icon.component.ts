import {Component, input} from '@angular/core';

@Component({
  selector: 'icon-cross',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg"
         [attr.width]="size()"
         [attr.height]="size()"
         viewBox="0 0 21 21" fill="none">
      <path d="M20.5 20.5L0.5 0.5M20.5 0.5L0.5 20.5" stroke="currentColor" stroke-linecap="round" [attr.stroke-width]="strokeWidth()"/>
    </svg>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg{
      color:var(--text-color);
    }
  `
})
export class CrossIconComponent {
  size = input<number>(21);
  strokeWidth = input<number>(1);
}

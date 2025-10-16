import {Component, input} from '@angular/core';

@Component({
  selector: 'icon-dropdown-arrow',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg"
         [attr.width]="width()"
         [attr.height]="height()"
         viewBox="0 0 23 12" fill="none">
      <path d="M0.5 0.5L11.5 11.5L22.5 0.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" [attr.stroke-width]="strokeWidth()"/>
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
export class DropdownArrowIconComponent {
  height = input<number>(23);
  width = input<number>(12);
  strokeWidth = input<number>(1);
}

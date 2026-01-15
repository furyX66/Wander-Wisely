import {Component, input} from '@angular/core';

@Component({
  selector: 'icon-arrow',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg"
         [attr.width]="size()"
         [attr.height]="size()"
         viewBox="0 0 22 22"
         fill="none"
    >
      <circle class="circle-outline" cx="11" cy="11" r="10.5" stroke="currentColor" fill="var(--assistant-message-color)" [attr.stroke-width]="strokeWidth()"/>
      <path d="M12 6L8 11L12 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  styles: `
    :host {
      cursor: pointer;
      display: inline-block;
    }
    svg{
      color: var(--text-color);
      display: block;
    }
    .circle-outline:hover {
      stroke-width: 1;
    }
  `
})
export class ArrowIconComponent {
  size = input<number>(36);
  strokeWidth = input<number>(1);
}

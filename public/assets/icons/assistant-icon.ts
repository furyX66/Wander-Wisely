import {Component, input} from '@angular/core';

@Component({
  selector: 'icon-assistant',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg"
         [attr.width]="width()"
         [attr.height]="height()"
         viewBox="0 0 24 21" fill="none">
      <rect x="1" y="1" width="22" height="15.2" rx="3" stroke="currentColor" [attr.stroke-width]="strokeWidth()"/>
      <path d="M12 16.2V20" stroke="currentColor" [attr.stroke-width]="strokeWidth()"/>
      <path d="M7.11108 20H16.8889" stroke="currentColor" stroke-linecap="round" [attr.stroke-width]="strokeWidth()"/>
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
    }
    svg{
      color: var(--text-color);
      display: block;
    }
  `
})
export class AssistantIconComponent {
  width = input<number | string>(24);
  height = input<number | string>(21);
  strokeWidth = input<number | string>(1);
}

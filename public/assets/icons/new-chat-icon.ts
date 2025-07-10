import {Component, input} from '@angular/core';

@Component({
  selector: 'icon-new-chat',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clip-path="url(#clip0_1_186)">
        <rect x="0.5" y="0.5" width="19" height="19" rx="4.5" stroke="currentColor"/>
        <path d="M10 5.5V14.5" stroke="currentColor" stroke-linecap="round"/>
        <path d="M5.5 10L14.5 10" stroke="currentColor" stroke-linecap="round"/>
      </g>
      <defs>
        <clipPath id="clip0_1_186">
          <rect width="20" height="20" fill="none"/>
        </clipPath>
      </defs>
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
export class NewChatIconComponent {
  selected = input<boolean>(false);
}

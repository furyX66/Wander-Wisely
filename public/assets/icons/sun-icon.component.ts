import { Component } from '@angular/core';

@Component({
  selector: 'icon-sun',
  imports: [],
  template: `
    <svg width="30" height="30" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="4.5" stroke="currentColor"/>
      <path d="M11 4L11 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.12132 6.12132L4 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 11L21 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 6.12132L18.1213 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11 21V18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18.071 18.071L15.9497 15.9497" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M1 11L4 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3.92897 18.071L6.05029 15.9497" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  `,
  styles: `
    :host{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg{
      color: var(--text-color)
    }
  `
})
export class SunIconComponent {

}

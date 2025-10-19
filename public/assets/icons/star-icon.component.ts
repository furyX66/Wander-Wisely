import { Component } from '@angular/core';

@Component({
  selector: 'icon-star',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 0.5L9.0085 4.56472L13.5 5.22053L10.25 8.3827L11.017 12.85L7 10.7397L2.983 12.85L3.75 8.3827L0.5 5.22053L4.9915 4.56472L7 0.5Z" stroke="#FFBA08" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
    }`
})
export class StarIconComponent {

}

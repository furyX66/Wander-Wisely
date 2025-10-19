import { Component } from '@angular/core';

@Component({
  selector: 'icon-money',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5.50391 9.74738C5.50391 10.7149 6.24641 11.4949 7.16891 11.4949H9.05141C9.85391 11.4949 10.5064 10.8124 10.5064 9.97238C10.5064 9.05738 10.1089 8.73488 9.51641 8.52488L6.49391 7.47488C5.90141 7.26488 5.50391 6.94238 5.50391 6.02738C5.50391 5.18738 6.15641 4.50488 6.95891 4.50488H8.84141C9.76391 4.50488 10.5064 5.28488 10.5064 6.25238M8 3.5V12.5M10.25 15.5H5.75C2 15.5 0.5 14 0.5 10.25V5.75C0.5 2 2 0.5 5.75 0.5H10.25C14 0.5 15.5 2 15.5 5.75V10.25C15.5 14 14 15.5 10.25 15.5Z" stroke="#44BBA4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `
})
export class MoneyIconComponent {

}

import { Component } from '@angular/core';

@Component({
  selector: 'icon-search',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M6.72222 12.9444C10.1587 12.9444 12.9444 10.1587 12.9444 6.72222C12.9444 3.28578 10.1587 0.5 6.72222 0.5C3.28578 0.5 0.5 3.28578 0.5 6.72222C0.5 10.1587 3.28578 12.9444 6.72222 12.9444Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14.5002 14.5L11.1558 11.1555" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  styles: `
    :host{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg{
      height: 20px;
      width: 20px;
      color: var(--text-color)
    }
  `
})
export class SearchIconComponent {

}

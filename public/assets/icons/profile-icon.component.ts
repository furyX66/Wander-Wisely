import {Component, input} from '@angular/core';

@Component({
  selector: 'icon-profile',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg"
         [attr.width]="size()"
         [attr.height]="size()"
         viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10" stroke="currentColor" [attr.stroke-width]="strokeWidth()"/>
      <path d="M10.9999 11.5285C12.7063 11.5285 14.0896 10.1452 14.0896 8.43883C14.0896 6.73243 12.7063 5.34912 10.9999 5.34912C9.29346 5.34912 7.91016 6.73243 7.91016 8.43883C7.91016 10.1452 9.29346 11.5285 10.9999 11.5285Z" stroke="currentColor" stroke-miterlimit="10" [attr.stroke-width]="strokeWidth()"/>
      <path d="M5.11768 16.8724L5.32496 15.8388C5.56983 14.6451 6.27159 13.5663 7.30832 12.7898C8.34506 12.0133 9.65127 11.5882 11 11.5884C12.3504 11.5887 13.6579 12.0152 14.6948 12.7937C15.7318 13.5722 16.4326 14.6533 16.6751 15.8489L16.8824 16.8825" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" [attr.stroke-width]="strokeWidth()"/>
      <path d="M5.11768 16.8823L16.8824 16.8823" stroke="currentColor" stroke-linecap="round" [attr.stroke-width]="strokeWidth()"/>
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
export class ProfileIconComponent {
  size = input<number | string>(26);
  strokeWidth = input<number | string>(1);
}

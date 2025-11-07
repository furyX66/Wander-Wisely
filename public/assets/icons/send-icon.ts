import {Component} from '@angular/core';

@Component({
  selector: 'icon-send',
  imports: [],
  template: `
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="Send icon">
        <path id="Vector"
              d="M10.0006 10.003H3.12505M2.93017 10.9342L1.79423 14.44C1.17209 16.3601 0.861019 17.3202 1.08426 17.9113C1.27811 18.4248 1.69449 18.814 2.20827 18.9622C2.79989 19.1328 3.69348 18.7173 5.48066 17.8864L16.9381 12.5594C18.6826 11.7483 19.5548 11.3429 19.8243 10.7795C20.0586 10.2901 20.0586 9.71574 19.8243 9.22632C19.5548 8.66307 18.6826 8.25752 16.9381 7.44646L5.4609 2.11031C3.6791 1.2819 2.78822 0.867692 2.19717 1.03761C1.68388 1.18517 1.26755 1.57338 1.07302 2.08586C0.849013 2.67596 1.15676 3.63393 1.77227 5.54988L2.93237 9.16114C3.03808 9.49019 3.09094 9.65477 3.1118 9.82297C3.13032 9.97237 3.13013 10.1235 3.11125 10.2728C3.08996 10.441 3.0367 10.6054 2.93017 10.9342Z"
              stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    svg{
      color: oklch(0.5712 0.1784 279.51);
    }
  `
})
export class SendIconComponent {
}

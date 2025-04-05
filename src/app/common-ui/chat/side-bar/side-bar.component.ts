import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {LoginButtonComponent} from '../../login-button/login-button.component';
import {SignUpButtonComponent} from '../../sign-up-button/sign-up-button.component';
import {ColorSchemeSwitchComponent} from '../../color-scheme-switch/color-scheme-switch.component';
import {LogoComponent} from '../../logo/logo.component';

@Component({
  selector: 'app-side-bar',
  imports: [
    NgForOf,
    LoginButtonComponent,
    SignUpButtonComponent,
    ColorSchemeSwitchComponent,
    LogoComponent
  ],
  templateUrl: './side-bar.component.html',
  standalone: true,
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  selectedItem: string | null = null;

  selectItem(text: string) {
    if (this.selectedItem === text) {
      this.selectedItem = null;
    } else {
      this.selectedItem = text;
    }
  }
  timelineData = [
    {
      label: 'Today',
      items: [{ text: '7 days euro tour', bold: false }]
    },
    {
      label: 'Yesterday',
      items: [
        { text: 'Katowice to Paris', bold: false },
        { text: 'Gothic architecture in Chor...', bold: false }
      ]
    },
    {
      label: 'Week ago',
      items: [
        { text: 'Polish museums', bold: false },
        { text: 'Chorzów ruch tour', bold: true }
      ]
    }
  ];
}

import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-color-scheme-switch',
  imports: [NgOptimizedImage],
  templateUrl: './color-scheme-switch.component.html',
  standalone: true,
  styleUrl: './color-scheme-switch.component.scss'
})
export class ColorSchemeSwitchComponent {
  isDarkTheme = false;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const body = document.body;
    body.classList.toggle('dark-mode');
  }

  get iconPath() {
    return this.isDarkTheme ? '/assets/icons/moon-icon.svg' : '/assets/icons/sun-icon.svg';
  }
}

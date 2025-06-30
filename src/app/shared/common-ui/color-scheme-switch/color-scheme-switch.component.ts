import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-color-scheme-switch',
  imports: [NgOptimizedImage],
  templateUrl: './color-scheme-switch.component.html',
  standalone: true,
  styleUrl: './color-scheme-switch.component.scss'
})
export class ColorSchemeSwitchComponent implements OnInit {
  isDarkTheme = false;

  ngOnInit() {
    const saved = localStorage.getItem('isDarkTheme');
    if (saved !== null) {
      this.isDarkTheme = saved === 'true';
    } else {
      this.isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.updateBodyClass();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('isDarkTheme', String(this.isDarkTheme));
    this.updateBodyClass();
  }

  updateBodyClass() {
    document.body.classList.toggle('dark-mode', this.isDarkTheme);
  }

  get iconPath() {
    return this.isDarkTheme ? 'assets/icons/moon-icon.svg' : 'assets/icons/sun-icon.svg';
  }
}

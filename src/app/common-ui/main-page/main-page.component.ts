import { Component, OnInit } from '@angular/core';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import { CommonModule } from '@angular/common';

// @ts-ignore
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [
    CommonModule
  ],
  standalone: true
})

export class MainPageComponent implements OnInit {
  words: string[] = ['plan', 'travel', 'explore', 'dream', 'discover'];
  currentWordIndex = 0;
  currentWord = this.words[0];

  ngOnInit() {
    this.startWordRotation();
  }

  startWordRotation() {
    setInterval(() => {
      this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
      this.currentWord = this.words[this.currentWordIndex];
    }, 2000);
  }
}

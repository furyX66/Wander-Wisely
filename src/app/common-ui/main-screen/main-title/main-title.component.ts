import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-main-title',
  templateUrl: './main-title.component.html',
  styleUrls: ['./main-title.component.scss'],
  imports: [
    CommonModule,
    RouterLink
  ],
  standalone: true
})

export class MainTitleComponent implements OnInit {
  words: string[] = ['plan', 'travel', 'explore', 'dream', 'discover'];
  currentWordIndex = 0;

  ngOnInit() {
    this.startWordRotation();
  }

  startWordRotation() {
    setInterval(() => {
      this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
    }, 2000);
  }
}

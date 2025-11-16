import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-options-bar',
  imports: [],
  templateUrl: './options-bar.component.html',
  styleUrl: './options-bar.component.scss'
})
export class OptionsBarComponent {
  whereFrom = signal<string>("1")
  whereTo = signal<string>("1")
  dates = signal<string>("1")
  budget = signal<string>("1")
}

import { Component } from '@angular/core';
import {MainTitleComponent} from '../main-title/main-title.component';
import {HeaderComponent} from '../header/header.component';


@Component({
  selector: 'app-main-page',
  imports: [MainTitleComponent, HeaderComponent],
  templateUrl: './main-page.component.html',
  standalone: true,
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}

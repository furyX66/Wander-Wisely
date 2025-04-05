import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './common-ui/header/header.component';
import {MainPageComponent} from './common-ui/main-page/main-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MainPageComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'WanderWisely';
}

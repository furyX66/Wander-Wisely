import {Component, inject} from '@angular/core';
import {MainTitleComponent} from '../../shared/main-screen/main-title/main-title.component';
import {HeaderComponent} from '../../shared/main-screen/header/header.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [MainTitleComponent, HeaderComponent],
  templateUrl: './main-page.component.html',
  standalone: true,
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent  {
  private router = inject(Router);

  startChatting(): void {
    this.router.navigate(['/chat']);

  }
}


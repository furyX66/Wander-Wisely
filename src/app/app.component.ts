import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthService} from './core/services/auth.service';
import {
  ModalContainerComponentComponent
} from './shared/modals/modal-container-component/modal-container-component.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalContainerComponentComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.isLoggedIn().subscribe();
  }
}

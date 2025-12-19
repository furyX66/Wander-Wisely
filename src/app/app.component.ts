import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthService} from './core/services/auth.service';
import {
  ModalContainerComponentComponent
} from './shared/modals/modal-container-component/modal-container-component.component';
import {UserService} from './core/services/user.service';
import {filter, switchMap} from 'rxjs';
import {NotificationComponent} from './shared/common-ui/notification/notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalContainerComponentComponent, NotificationComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  ngOnInit() {
    this.authService.isLoggedIn().subscribe();

    this.authService.authStatus$
      .pipe(
        filter(status => status === true),
        switchMap(() => this.userService.getCurrentUser())
      ).subscribe();
  }
}

import {Component, inject, OnInit, signal} from '@angular/core';
import {Notification, NotificationService} from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',

})
export class NotificationComponent implements OnInit {
  private notificationService = inject(NotificationService);
  notification = signal<Notification | null>(null);

  ngOnInit(): void {
    this.notificationService.notification$.subscribe(n => {
      this.notification.set(n);
      if (n) {
        setTimeout(() => {
          this.notification.set(null);
        }, 3000);
      }
    });
  }
}

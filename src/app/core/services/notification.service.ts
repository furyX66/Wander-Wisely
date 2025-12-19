import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  notification$: Observable<Notification | null> = this.notificationSubject.asObservable();

  showSuccess(message: string): void {
    this.notificationSubject.next({ message, type: 'success' });
  }

  showError(message: string): void {
    this.notificationSubject.next({ message, type: 'error' });
  }

  showInfo(message: string): void {
    this.notificationSubject.next({ message, type: 'info' });
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
}

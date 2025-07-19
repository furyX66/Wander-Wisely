import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private editProfileModalSource = new Subject<boolean>();
  editProfileModal$ = this.editProfileModalSource.asObservable();

  openEditProfileModal() {
    this.editProfileModalSource.next(true);
  }
  closeEditProfileModal() {
    this.editProfileModalSource.next(false);
  }
}

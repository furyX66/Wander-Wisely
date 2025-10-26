import {Component, output} from '@angular/core';
import {ButtonComponent} from '../../common-ui/button/button.component';

@Component({
  selector: 'app-close-modal',
  imports: [
    ButtonComponent
  ],
  templateUrl: './close-modal.component.html',
  styleUrl: './close-modal.component.scss'
})
export class CloseModalComponent {
  close = output<void>();
  closeAnotherModal = output<void>();

  closeModal() {
    this.close.emit();
  }

  handleClose() {
    this.closeAnotherModal.emit();
  }

  handleStay() {
    this.close.emit();
  }
}

import {Component, output} from '@angular/core';
import {ButtonComponent} from '../../common-ui/button/button.component';
import {InputComponent} from '../../common-ui/input/input.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-enter-trip-name',
  imports: [
    ButtonComponent,
    InputComponent,
    FormsModule
  ],
  templateUrl: './enter-trip-name.component.html',
  styleUrl: './enter-trip-name.component.scss'
})
export class EnterTripNameComponent {
  tripName = 'My trip';
  close = output<void>();
  saveTrip = output<string>();

  closeModal() {
    this.close.emit();
  }

  handleSave() {
    this.saveTrip.emit(this.tripName);
    this.close.emit();
  }
}

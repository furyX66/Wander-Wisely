import {Component, inject, input, signal} from '@angular/core';
import {IBudgetOption} from '../../../../interfaces/IBudgetOption';
import {ClickOutsideDirective} from '../../../core/helpers/directives/click-outside.directive';
import {DropdownArrowIconComponent} from '../../../../../public/assets/icons/dropdown-arrow-icon.component';
import {DatePickerComponent} from '../date-picker/date-picker.component';
import {CityAutocompleteInputComponent} from '../city-autocomplete-input/city-autocomplete-input.component';
import {ModalService} from '../../../core/services/modal.service';
import {ModalType} from '../../../../enums/ModalType';

@Component({
  selector: 'app-options-bar',
  imports: [
    ClickOutsideDirective,
    DropdownArrowIconComponent,
    DatePickerComponent,
    CityAutocompleteInputComponent,

  ],
  templateUrl: './options-bar.component.html',
  styleUrl: './options-bar.component.scss'
})
export class OptionsBarComponent {
  private modalService = inject(ModalService);
  whereFrom = signal<string>("")
  whereTo = signal<string>("")
  budget = signal<string>("")

  hasSelectedAttractions  = input<boolean>(false);

  isBudgetDropdownOpen = signal<boolean>(false);
  isWhereToDropdownOpen = signal<boolean>(false);
  isWhereFromDropdownOpen = signal<boolean>(false);

  budgetOptions: IBudgetOption[] = [
    {id: '1', label: '$ (Budget)'},
    {id: '2', label: '$$ (Moderate)'},
    {id: '3', label: '$$$ (Expensive)'},
    {id: '4', label: '$$$$ (Luxury)'}
  ];

  toggleBudgetDropdown(): void {
    this.isBudgetDropdownOpen.update(v => !v);
  }

  toggleWhereToInput(): void {
    this.isWhereToDropdownOpen.update(v => !v);
  }

  toggleWhereFromInput(): void {
    this.isWhereFromDropdownOpen.update(v => !v);
  }

  closeBudgetDropdown(): void {
    this.isBudgetDropdownOpen.set(false);
  }

  closeWhereToDropdown(): void {
    this.isWhereToDropdownOpen.set(false);
  }

  closeWhereFromDropdown(): void {
    this.isWhereFromDropdownOpen.set(false);
  }

  clearWhereFrom(): void {
    this.whereFrom.set("")
  }

  clearWhereTo(): void {
    this.whereTo.set("")
  }

  openTripNameModal(): void {
    this.modalService.openModal(ModalType.ENTER_TRIP_NAME)
  }

  selectBudgedOption(option: IBudgetOption): void {
    if (this.budget() === option.label) {
      this.budget.set('');
    } else {
      this.budget.set(option.label);
    }
    this.closeBudgetDropdown();
  }

  getDollarSign(): string {
    if (this.budget() === "") return "";
    const match = this.budget().match(/^\$+/);
    return match ? match[0] : '$$';
  }
}

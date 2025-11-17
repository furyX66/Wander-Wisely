import {AfterViewInit, Component, ElementRef, signal, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DatePickerComponent implements AfterViewInit {
  @ViewChild('dateInput') dateInput!: ElementRef;
  @ViewChild('dateButton') dateButton!: ElementRef;

  dates = signal<string>('');
  picker: any;

  ngAfterViewInit(): void {
    this.picker = flatpickr(this.dateInput.nativeElement, {
      mode: 'range',
      minDate: 'today',
      dateFormat: 'M d',
      showMonths: 2,
      positionElement: this.dateButton.nativeElement,
      position: "below center",
      locale: {
        firstDayOfWeek: 1
      },
      onChange: (selectedDates: Date[]) => {
        if (selectedDates.length === 2) {
          const start = this.format(selectedDates[0]);
          const end = this.format(selectedDates[1]);
          this.dates.set(`${start} - ${end}`);
        }
        if (selectedDates.length === 1) {
          const start = this.format(selectedDates[0]);
          this.dates.set(start);
        }
      }
    });
  }

  openPicker(): void {
    this.picker?.open();
  }

  format(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

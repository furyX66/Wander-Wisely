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
  pickerOpen = signal(false);

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
      },
      onReady: (selectedDates, dateStr, instance) => {
        const calendar = instance.calendarContainer;
        let clearBtn = calendar.querySelector('.custom-clear-btn') as HTMLElement;
        if (!clearBtn) {
          clearBtn = document.createElement('button');
          clearBtn.textContent = 'Clear';
          clearBtn.className = 'custom-clear-btn';
          clearBtn.style.cssText = `
          margin: 0.5rem auto 0 auto;
          padding: 0.5rem 2rem;
          border:none;
          border-radius: 50px;
          background: transparent;
          color: var(--text-color);
          cursor: pointer;
        `;
          clearBtn.onmouseenter = () => {
            clearBtn.style.background = 'var(--hover-color, )';
          };
          clearBtn.onmouseleave = () => {
            clearBtn.style.background = 'transparent';
          };
          clearBtn.onclick = () => {
            this.dates.set('');
            instance.clear();
          };
          calendar.appendChild(clearBtn);
        }
      }
    });
  }

  togglePicker(): void {
    this.pickerOpen.update(open => !open);
    if (!this.picker) return;
    if (this.pickerOpen()) {
      this.picker.open();
    } else {
      this.picker.close();
    }
  }

  format(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

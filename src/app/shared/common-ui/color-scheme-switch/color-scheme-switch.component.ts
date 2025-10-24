import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {ThemeService} from '../../../core/services/theme.service';
import {MoonIconComponent} from '../../../../../public/assets/icons/moon-icon.component';
import {SunIconComponent} from '../../../../../public/assets/icons/sun-icon.component';

@Component({
  selector: 'app-color-scheme-switch',
  imports: [CommonModule, MoonIconComponent, SunIconComponent],
  templateUrl: './color-scheme-switch.component.html',
  standalone: true,
  styleUrl: './color-scheme-switch.component.scss'
})
export class ColorSchemeSwitchComponent {
  private themeService = inject(ThemeService);

  isDarkTheme$: Observable<boolean> = this.themeService.theme$.pipe(
    shareReplay(1)
  );

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

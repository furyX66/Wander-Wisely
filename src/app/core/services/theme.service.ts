import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private STORAGE_KEY = 'isDarkTheme';

  private themeSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  theme$: Observable<boolean> = this.themeSubject.asObservable();

  constructor() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.STORAGE_KEY && event.newValue) {
        this.themeSubject.next(event.newValue === 'true');
        this.applyTheme(event.newValue === 'true');
      }
    });

    this.applyTheme(this.themeSubject.value);
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved !== null) {
      return saved === 'true';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme(): void {
    const newTheme = !this.themeSubject.value;
    this.setTheme(newTheme);
  }

  setTheme(isDark: boolean): void {
    this.themeSubject.next(isDark);
    localStorage.setItem(this.STORAGE_KEY, String(isDark));
    this.applyTheme(isDark);
  }

  isDarkTheme(): boolean {
    return this.themeSubject.value;
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-mode');
    }
  }
}

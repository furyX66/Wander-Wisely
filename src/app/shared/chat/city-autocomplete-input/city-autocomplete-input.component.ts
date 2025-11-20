import {Component, inject, OnInit, output, signal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, of, switchMap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {
  LoadingAnimationComponent
} from '../../../../../public/assets/animations/loading-animation/loading-animation.component';

interface CityOption {
  displayName: string;
  cityName: string;
}

interface NominatimResult {
  display_name: string;
  name: string;
  type: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

@Component({
  selector: 'app-city-autocomplete-input',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LoadingAnimationComponent
  ],
  templateUrl: './city-autocomplete-input.component.html',
  styleUrl: './city-autocomplete-input.component.scss'
})
export class CityAutocompleteInputComponent implements OnInit {
  private http = inject(HttpClient);
  searchControl = new FormControl('');
  cities = signal<CityOption[]>([]);
  isLoading = signal<boolean>(false);

  citySelected = output<string>();

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.trim().length < 2) {
          return of([]);
        }
        this.isLoading.set(true);
        return this.http.get<NominatimResult[]>(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: query,
              format: 'json',
              addressdetails: '1',
              limit: '10'
            },
            headers: {
              'User-Agent': 'YourAppName/1.0'
            }
          }
        ).pipe(
          map(results => {
            const filtered = results.filter(r =>
              r.type === 'city' ||
              r.type === 'town' ||
              r.type === 'village' ||
              r.type === 'place' ||
              r.type === 'administrative' ||
              r.type === 'hamlet'
            );

            // Формируем массив CityOption с двумя полями
            const formatted: CityOption[] = filtered.map(r => {
              const addr = r.address;
              const cityName = addr?.city || addr?.town || addr?.village || r.name;

              if (!addr) {
                return {
                  displayName: r.display_name,
                  cityName: r.name
                };
              }

              const parts: string[] = [];
              if (cityName) parts.push(cityName);
              if (addr.state) parts.push(addr.state);
              if (addr.country) parts.push(addr.country);

              return {
                displayName: parts.join(', ') || r.display_name,
                cityName: cityName
              };
            });

            // Удаляем дубликаты по displayName
            const uniqueMap = new Map<string, CityOption>();
            formatted.forEach(item => {
              if (!uniqueMap.has(item.displayName)) {
                uniqueMap.set(item.displayName, item);
              }
            });

            return Array.from(uniqueMap.values());
          }),
          catchError(() => of([]))
        );
      })
    ).subscribe(cityOptions => {
      this.cities.set(cityOptions);
      this.isLoading.set(false);
    });
  }

  selectOption(option: CityOption) {
    this.searchControl.setValue(option.displayName);
    this.cities.set([]);
    this.citySelected.emit(option.cityName);
  }
}

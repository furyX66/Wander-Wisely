import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, of, switchMap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {
  LoadingAnimationComponent
} from '../../../../../public/assets/animations/loading-animation/loading-animation.component';

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
  cities = signal<string[]>([]);
  isLoading = signal<boolean>(false);

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

            const formatted = filtered.map(r => {
              const addr = r.address;
              if (!addr) return r.display_name;

              const parts: string[] = [];
              const city = addr.city || addr.town || addr.village;
              if (city) parts.push(city);
              if (addr.state) parts.push(addr.state);
              if (addr.country) parts.push(addr.country);

              return parts.join(', ') || r.display_name;
            });

            return [...new Set(formatted)];
          }),
          catchError(() => of([]))
        );
      })
    ).subscribe(cityNames => {
      this.cities.set(cityNames);
      this.isLoading.set(false);
    });
  }

  selectOption(country: string) {
    this.searchControl.setValue(country);
    this.cities.set([]);
  }
}

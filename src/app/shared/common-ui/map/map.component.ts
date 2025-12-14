import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {AttractionsCarouselComponent} from '../../chat/attractions-carousel/attractions-carousel.component';
import {IAttraction} from '../../../../interfaces/IAttraction';
import {Observable, Subject, takeUntil} from 'rxjs';
import {ChatSessionService} from '../../../core/services/chat-session.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  standalone: true,
  imports: [AttractionsCarouselComponent, AsyncPipe],
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit, OnDestroy, OnInit {
  private destroy$ = new Subject<void>();
  private chatSessionService = inject(ChatSessionService);
  private attractionMarkers: L.Marker[] = [];
  private themeObserver?: MutationObserver;
  private mapInitialized = false;
  private currentTheme: 'light' | 'dark' = 'light';
  attractions$!: Observable<IAttraction[]>;

  constructor() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/assets/leaflet/marker-icon-2x.png',
      iconUrl: '/assets/leaflet/marker-icon.png',
      shadowUrl: '/assets/leaflet/marker-shadow.png',
    });
  }

  ngOnInit() {
    this.attractions$ = this.chatSessionService.attractions$;
  }

  private map!: L.Map;
  private currentTiles!: L.TileLayer;

  private tilesLight = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 3,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });

  private tilesDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    minZoom: 3,
    attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
  });

  ngAfterViewInit(): void {
    this.initMap();
    this.observeThemeChanges();
    this.setupAttractionsEffect();
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
    this.map?.remove();
  }

  private setupAttractionsEffect(): void {
    this.attractions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(attractions => {
        if (this.mapInitialized) {
          if (attractions.length > 0) {
            this.displayAttractions(attractions);
          } else {
            this.clearAttractionMarkers();
          }
        }
      });
  }

  private initMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map container element not found');
      return;
    }

    this.map = L.map('map', {
      center: [52.2297, 21.0122],
      zoom: 3,
    });

    const isDark = this.isDarkMode();
    this.currentTheme = isDark ? 'dark' : 'light';
    this.applyTheme(isDark);
    this.mapInitialized = true;
  }

  private observeThemeChanges(): void {
    this.themeObserver = new MutationObserver(() => {
      const isDark = this.isDarkMode();
      const newTheme = isDark ? 'dark' : 'light';

      if (newTheme !== this.currentTheme) {
        this.currentTheme = newTheme;
        this.applyTheme(isDark);
      }
    });

    this.themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  private displayAttractions(attractions: IAttraction[]): void {
    this.clearAttractionMarkers();

    if (!attractions?.length) {
      return;
    }

    const bounds: Array<[number, number]> = [];

    attractions.forEach(attraction => {
      const marker = L.marker([attraction.latitude, attraction.longitude])
        .addTo(this.map)
        .bindPopup(this.createPopupContent(attraction));

      this.attractionMarkers.push(marker);
      bounds.push([attraction.latitude, attraction.longitude]);
    });

    if (bounds.length > 0) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private createPopupContent(attraction: IAttraction): string {
    const stars = '⭐'.repeat(Math.round(attraction.rating));
    const price = attraction.price !== null ? `${attraction.price} zł` : 'Free';
    const photo = attraction.photoUrl
      ? `<img src="${attraction.photoUrl}" alt="${attraction.name}" style="width: 100%; max-width: 200px; height: auto; border-radius: 4px; margin-bottom: 8px;">`
      : '';

    return `
      <div style="min-width: 150px;">
        ${photo}
        <h3 style="margin: 0 0 8px 0; font-size: 16px;">${attraction.name}</h3>
        <p style="margin: 4px 0; font-size: 14px;">
          <strong>Rating:</strong> ${stars} (${attraction.rating})
        </p>
        <p style="margin: 4px 0; font-size: 14px;">
          <b>Price:</b> ${price}
        </p>
        <p style="margin: 4px 0; color: #666; font-size: 14px;">
          <b>Type:</b> ${attraction.type}
        </p>
      </div>
    `;
  }

  private clearAttractionMarkers(): void {
    this.attractionMarkers.forEach(marker => {
      if (this.map.hasLayer(marker)) {
        this.map.removeLayer(marker);
      }
    });
    this.attractionMarkers = [];
  }

  private applyTheme(isDark: boolean): void {
    if (this.currentTiles && this.map.hasLayer(this.currentTiles)) {
      this.map.removeLayer(this.currentTiles);
    }
    this.currentTiles = isDark ? this.tilesDark : this.tilesLight;
    this.currentTiles.addTo(this.map);
  }

  private isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }
}

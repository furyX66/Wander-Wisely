import {AfterViewInit, Component, effect, input, OnDestroy} from '@angular/core';
import * as L from 'leaflet';
import {AttractionsCarouselComponent} from '../../chat/attractions-carousel/attractions-carousel.component';
import {IAttraction} from '../../../../interfaces/IAttraction';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  standalone: true,
  imports: [
    AttractionsCarouselComponent
  ],
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  attractions = input<IAttraction[] >([]);
  private attractionMarkers: L.Marker[] = [];

  constructor() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/assets/leaflet/marker-icon-2x.png',
      iconUrl: '/assets/leaflet/marker-icon.png',
      shadowUrl: '/assets/leaflet/marker-shadow.png',
    });

    effect(() => {
      const currentAttractions = this.attractions();
      if (this.map && currentAttractions.length > 0) {
        this.displayAttractions(currentAttractions);
      }
    });
  }

  private map!: L.Map;
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

  private observeThemeChanges(): void {
    const observer = new MutationObserver(() => {
      this.applyTheme(this.isDarkMode());
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  private currentTiles!: L.TileLayer;

  ngAfterViewInit(): void {
    this.initMap();
    this.observeThemeChanges();
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [52.2297, 21.0122],
      zoom: 3
    });

    this.applyTheme(this.isDarkMode());
  }

  private displayAttractions(attractions: IAttraction[]): void {
    this.clearAttractionMarkers();

    if (!attractions || attractions.length === 0) {
      return;
    }

    const bounds: L.LatLngBoundsExpression = [];

    attractions.forEach(attraction => {
      const latLng = L.latLng(attraction.latitude, attraction.longitude);

      const marker = L.marker(latLng)
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
      this.map.removeLayer(marker);
    });
    this.attractionMarkers = [];
  }

  private applyTheme(isDark: boolean): void {
    if (this.currentTiles) {
      this.map.removeLayer(this.currentTiles);
    }
    this.currentTiles = isDark ? this.tilesDark : this.tilesLight;
    this.currentTiles.addTo(this.map);
  }

  private isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }
}

import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  standalone: true,
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
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

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
    this.tryLocateUser();
    this.observeThemeChanges();
  }


  private initMap(): void {
    this.map = L.map('map', {
      center: [52.2297, 21.0122],
      zoom: 3
    });

    this.applyTheme(this.isDarkMode()); // ставим правильную тему на старте
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

  private tryLocateUser(): void {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      this.setDefaultMarker();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
        this.map.setView(userLatLng, 13);
        L.marker(userLatLng)
          .addTo(this.map)
          .bindPopup('You are here 📍')
          .openPopup();
      },
      error => {
        console.warn('Location access denied:', error);
        this.setDefaultMarker();
      }
    );
  }

  private setDefaultMarker(): void {
    const warsawLatLng = L.latLng(52.2297, 21.0122); // Варшава
    this.map.setView(warsawLatLng, 13);
    L.marker(warsawLatLng)
      .addTo(this.map)
      .bindPopup('Default place')
      .openPopup();
  }
}

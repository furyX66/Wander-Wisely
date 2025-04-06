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

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
    this.tryLocateUser();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [52.2297, 21.0122],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
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
      .bindPopup('Deafault place')
      .openPopup();
  }
}

import { Component, AfterViewInit } from '@angular/core';
import {
  map,
  Map,
  tileLayer,
  LatLngExpression,
  marker
} from 'leaflet';

const BolognaCoords: LatLngExpression = [44.494887, 11.342616];

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  protected map?: Map;
  protected mapId: string;

  constructor() {
    this.mapId = 'map';
  }

  private initMap(): void {
    this.map = map(this.mapId, {
      scrollWheelZoom: false,
      center: BolognaCoords,
      zoom: 10
    });

    const tiles = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'  // required for copyright
    });

    tiles.addTo(this.map);

    marker(BolognaCoords)
      .bindPopup('Trascina la mappa per cambiare la posizione')
      .addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}

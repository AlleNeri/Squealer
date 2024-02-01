import { Component, AfterViewInit, Input } from '@angular/core';
import {
  map,
  Map,
  tileLayer,
  marker,
  Marker,
  Icon,
  LatLng
} from 'leaflet';

@Component({
  selector: 'app-show-map',
  templateUrl: './show-map.component.html',
  styleUrls: ['./show-map.component.css']
})
export class ShowMapComponent implements AfterViewInit {
  protected map?: Map;
  protected mapId: string;
  private marker?: Marker
  private position!: LatLng;
  @Input({ required: true }) lat!: number;
  @Input({ required: true }) lng!: number;

  constructor() {
    this.position = new LatLng(0, 0);
    this.mapId = 'map-' + Math.random().toString(36).substring(7);
    console.log(this.mapId);
  }

  private initMap(): void {
    //Creating the map and setting the layers
    this.map = map(this.mapId, {
      scrollWheelZoom: false,
      center: this.position,
      zoom: 10
    });

    const tiles = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'  // required for copyright
    });

    tiles.addTo(this.map);

    //Creating the marker
    //remove the shadow from the marker, it's buggy
    const icon = new Icon.Default();
    icon.options.shadowUrl = '';
    icon.options.shadowSize = [0, 0];
    this.marker = marker(this.position, { icon });
    this.marker.bindPopup(`${this.lat.toFixed(2)}, ${this.lng.toFixed(2)} circa`)
    this.marker.addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.position = new LatLng(this.lat, this.lng);
    this.initMap();
  }
}

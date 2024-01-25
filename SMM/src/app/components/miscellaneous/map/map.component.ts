import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import {
  map,
  Map,
  tileLayer,
  LatLngExpression,
  marker,
  Marker,
  Icon,
  Control,
  DomUtil,
  LatLng
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
  private marker?: Marker
  private removeMarkerControl?: Control;
  @Output() positionSelected: EventEmitter<LatLng | undefined>;

  constructor() {
    this.mapId = 'map';
    this.positionSelected = new EventEmitter<LatLng | undefined>();
  }

  private initMap(): void {
    //Creating the map and setting the layers
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

    //creating the marker on click handler
    this.map.on('click', (e) => {
      //emit the position
      this.positionSelected.emit(e.latlng);
      //remove the old marker if it exists
      this.removeMarker();
      //create the new marker
      //remove the shadow from the marker, it's buggy
      const icon = new Icon.Default();
      icon.options.shadowUrl = '';
      icon.options.shadowSize = [0, 0];
      this.marker = marker(e.latlng, { icon })
        .bindPopup(`Posizione selezionata: ${e.latlng.lat.toFixed(2)}, ${e.latlng.lng.toFixed(2)} circa`)
        .addTo(this.map!);
      //add the remove marker button
      const RemoveMarkerControl = Control.extend({
        options: {
          position: 'topleft'
        },
        onAdd: () => {
          const container = DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

          container.innerHTML = '<img src="assets/map-marker-slash.svg" alt="X" style="width: 22px; height: 22px; margin: 4px 4px 4px 4px;"/>';

          container.style.backgroundColor = 'white';
          container.style.width = '34px';
          container.style.height = '34px';

          container.onclick = (eContainer) => {
            eContainer.stopPropagation();
            this.positionSelected.emit(undefined);
            this.removeMarker();
          }
          return container;
        }
      });
      if(this.marker) {
        this.removeMarkerControl = new RemoveMarkerControl();
        this.map!.addControl(this.removeMarkerControl);
      }
    });
  }

  removeMarker() {
    this.marker?.remove();
    this.marker = undefined;
    if(this.removeMarkerControl)
      this.map?.removeControl(this.removeMarkerControl);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}

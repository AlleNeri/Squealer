import { Component, Input } from '@angular/core';

import Client from 'src/app/classes/client';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.css']
})
export class ClientCardComponent {
  @Input({required: true}) client!: Client;
}

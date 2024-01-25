import { Component, Input } from '@angular/core';

import { BackendComunicationService } from 'src/app/services/backend-comunication.service';

import Client from 'src/app/classes/client';

import IUser from 'src/app/interfaces/user';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input({required: true}) user!: IUser;
  @Input() clients?: Client[];

  constructor(protected backendComunication: BackendComunicationService) {}
}

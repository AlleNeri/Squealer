import { Component } from '@angular/core';

import { UserInformationService } from "src/app/services/user-information.service";

import Client from "src/app/classes/client";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent  {
  protected isVisible: boolean;
  protected  selectedClient?: string;

  constructor(
    private userInfo: UserInformationService,
  ) {
    this.isVisible = false;
  }

  get clients(): Client[] { return this.userInfo.clients; }

  toggleVisibility(): void {
    this.selectedClient = undefined;
    this.isVisible = !this.isVisible;
  }

  areThereClients(): boolean {
    if(this.clients === undefined) return false;
    return this.userInfo.clients.length > 0;
  }

  handleOk(): void {
    if(this.selectedClient != undefined) this.userInfo.removeClient(this.selectedClient);
    this.toggleVisibility();
  }
}

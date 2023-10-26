import { Component } from '@angular/core';

import { IUser, UserInformationService } from '../../services/user-information.service';
import { BackendComunicationService } from '../../services/backend-comunication.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css']
})
export class DashboardSidebarComponent {
  public clients: IUser[];

  constructor(
    private userInfo: UserInformationService,
    private backendComunication: BackendComunicationService,
  ) {
    this.clients = [];
    //TODO: spostare questo per renderlo riusabile
    if (this.userInfo.user && this.userInfo.user.friends)
      for(const friend of this.userInfo.user.friends) {
        if(friend) this.backendComunication.get(`users/${friend}`)
          .subscribe((clientInfo: any) => {
            console.log(clientInfo)
            this.clients.push(clientInfo);
          });
      }
  }

  /* TODO: add sidebar toggle functionality
  public isCollapsed=false;

  toggleSidebar() {
    this.isCollapsed=!this.isCollapsed;
  }*/
}

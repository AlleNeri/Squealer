import { Component } from '@angular/core';

import { IUser, UserInformationService } from '../../services/user-information.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css']
})
export class DashboardSidebarComponent {
  public clients: IUser[];

  constructor(private userInfo: UserInformationService) {
    this.clients = [];
    this.userInfo.userInformationEvent.subscribe((_: IUser)=> this.clients=this.userInfo.clients);
  }

  /* TODO: add sidebar toggle functionality
  public isCollapsed=false;

  toggleSidebar() {
    this.isCollapsed=!this.isCollapsed;
  }*/
}

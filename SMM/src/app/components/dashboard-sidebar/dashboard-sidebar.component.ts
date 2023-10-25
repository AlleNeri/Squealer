import { Component } from '@angular/core';

import { UserInformationService } from '../../services/user-information.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css']
})
export class DashboardSidebarComponent {
  constructor(private userInfo: UserInformationService) { }


  /* TODO: add sidebar toggle functionality
  public isCollapsed=false;

  toggleSidebar() {
    this.isCollapsed=!this.isCollapsed;
  }*/
}

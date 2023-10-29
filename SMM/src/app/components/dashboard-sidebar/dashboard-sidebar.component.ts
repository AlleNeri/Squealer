import { Component, OnChanges, OnInit } from '@angular/core';

import IUser from 'src/app/interfaces/user';

import Client from 'src/app/classes/client';

import { UserInformationService } from '../../services/user-information.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css']
})
export class DashboardSidebarComponent implements OnChanges, OnInit {
  public clients: Client[];

  constructor(private userInfo: UserInformationService) {
    this.clients = [];
    this.userInfo.userInformationEvent.subscribe((_: IUser)=> this.clients=this.userInfo.clients);
    console.log(this.clients);
  }

  ngOnInit() {
    this.clients = this.userInfo.clients;
  }

  ngOnChanges() {
    this.clients = this.userInfo.clients;
  }
  /* TODO: add sidebar toggle functionality
  public isCollapsed=false;

  toggleSidebar() {
    this.isCollapsed=!this.isCollapsed;
  }*/
}

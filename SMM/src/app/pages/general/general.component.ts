import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserInformationService } from 'src/app/services/user-information.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  constructor(private auth: AuthenticationService, private router: Router, public userInfo: UserInformationService) { }

  /* redirect to login page if not logged in */
  ngOnInit() {
    if (!this.auth.isLoggedIn()) this.router.navigate(['/login']);
  }
}

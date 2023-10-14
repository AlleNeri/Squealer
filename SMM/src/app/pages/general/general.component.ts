import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  constructor(private auth: AuthenticationService, private router: Router)
  { }

  /* redirect to login page if not logged in */
  ngOnInit() {
    if (!this.auth.isLoggedIn()) this.router.navigate(['/login']);
  }
}

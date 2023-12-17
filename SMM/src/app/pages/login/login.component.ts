import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(public auth: AuthenticationService) {}

  // if the user is logged in, while the page is loading, log them out
  ngOnInit() {
    if(this.auth.isLoggedIn()) this.auth.logout();
  }
}

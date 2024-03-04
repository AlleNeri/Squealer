import { Component } from '@angular/core';

import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent {
  constructor(public auth: AuthenticationService) {}
}

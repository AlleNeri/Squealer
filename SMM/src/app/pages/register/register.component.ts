import { AfterContentInit, Component } from '@angular/core';
import {AuthenticationService} from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private auth: AuthenticationService) {}
  //TODO: creare un dialog per sloggarsi o tornare alla home page in caso si sia giaà loggati
}

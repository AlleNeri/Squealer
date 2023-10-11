import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';

interface ILoginBody {
  username: string,
  password: string
};

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.css']
})
export class LoginCardComponent {
  loginForm: FormGroup;

  constructor(private auth: AuthenticationService) {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    //get the data to sent to the server
    const body: ILoginBody=this.loginForm.value;
    console.log(body);
    //authenticate the user
    this.auth.login(body);
    console.log(this.auth.isLoggedIn());
  }
}

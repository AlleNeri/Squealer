import { Component } from '@angular/core';
import{ Router } from '@angular/router';
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
  public loginForm: FormGroup;

  constructor(private auth: AuthenticationService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    //get the data to sent to the server
    const body: ILoginBody=this.loginForm.value;
    //TODO: show some feedback to the user that the login is in progress
    //authenticate the user and redirect to the dashboard if the login is successful
    this.auth.login(body)
      .add(() => {
        if(this.auth.isLoggedIn()) this.router.navigate(['/smm']);
        else {
          this.loginForm.reset();
          alert("Login fallito");
        }
      });

  }
}

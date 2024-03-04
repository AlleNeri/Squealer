import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILoginBody } from 'src/app/interfaces/auth-user';

import { AuthenticationService } from '../../../services/authentication.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.css']
})
export class LoginCardComponent {
  protected buttonLoading: boolean;
  public loginForm: FormGroup;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private msgService: NzMessageService
  ) {
    this.buttonLoading=false;
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    this.buttonLoading=true;
    //get the data to sent to the server
    const body: ILoginBody=this.loginForm.value;
    //authenticate the user and redirect to the dashboard if the login is successful
    this.auth.login(body)
      .subscribe((_: any) => {
        this.buttonLoading=false;
        console.log(this.auth.isLoggedIn());
        if(this.auth.isLoggedIn() && this.auth.isSMM) this.router.navigate(['/smm']);
        else if(this.auth.isLoggedIn() && !this.auth.isSMM) {
          this.msgService.warning(`L'utente non è un SMM`);
          this.auth.logout();
        }
        else this.msgService.error(`Username o password errati`);
      },
      (_: any) => {
        this.buttonLoading=false;
        this.msgService.error(`Errore durante il login`);
      });
  }
}

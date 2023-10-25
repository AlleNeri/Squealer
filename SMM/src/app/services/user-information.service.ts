import { Injectable } from '@angular/core';

import { AuthenticationService } from './authentication.service';
import { BackendComunicationService } from './backend-comunication.service';

//TODO: spostare in un file apposito le definizioni tipi e interfacce
export interface IUser {
  u_name: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  type: string;
  chat_availablility?: number;
  img?: string; //TODO: look how to handle images
  b_date?: Date;
  appartenence?: string;
  friends?: string[];
};

@Injectable({
  providedIn: 'root'
})
export class UserInformationService {
  private userInformation?: IUser;

  constructor(private auth: AuthenticationService, private backendComunication: BackendComunicationService) {
    this.auth.logInObservable.subscribe(isLoggedIn=> {
      if (isLoggedIn) this.getUserInfo();
      else this.userInformation = undefined;
    });
  }

  private getUserInfo(): void {
    this.backendComunication.get(this.auth.userId!)
      .subscribe((d: Object)=> {
        console.log(d);
        this.userInformation=d as IUser;
      });
  }
}

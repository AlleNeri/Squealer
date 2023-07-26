import { Injectable } from '@angular/core';
import { BackendComunicationService } from './backend-comunication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loggedUser?: Object;  //TODO: definire l'oggetto di tipo utente per questo tipo di dato

  constructor(private backendComunication: BackendComunicationService) {
    this.checkCredentials();
  }

  checkCredentials() {
    const tmp=localStorage.getItem('user');
    if(tmp!==null) this.loggedUser=JSON.parse(tmp);
    else this.loggedUser=undefined;
  }

  register(data: Object) {  //TODO: definire l'oggetto di tipo utente per questo tipo di dato
    this.backendComunication.post("/register", data)  //TODO: modificar l'endpoint in maniera coerente col backend
    .subscribe((d: Object)=> {
      console.log(d);
      this.loggedUser=d;
    });
  }

  login() {}

  logout() {}

  isLoggedIn(): boolean {
    this.checkCredentials();
    if(this.loggedUser) return true;
    else return false;
  }
}

import { Injectable } from '@angular/core';
import { BackendComunicationService } from './backend-comunication.service';

//TODO: definire l'oggetto di tipo utente vedere più avanti

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loggedUser?: Object;  //TODO: definire l'oggetto di tipo utente per questo tipo di dato
  private logKey: string;

  constructor(private backendComunication: BackendComunicationService) {
    this.checkCredentials();
    this.logKey="user";
  }

  //undefined argument to remove the user from the local storage(logout)
  private set logUser(obj: Object | undefined) {
    if(obj===undefined) localStorage.removeItem(this.logKey);
    else localStorage.setItem(this.logKey, JSON.stringify(obj));
    this.loggedUser=obj;
  }

  checkCredentials() {
    const tmp=localStorage.getItem(this.logKey);
    if(tmp===null) this.loggedUser=undefined;
    else this.loggedUser=JSON.parse(tmp); //TODO: controllare se ci sono i campi utili
  }

  register(data: Object) {
    this.backendComunication.post("users/register", data)  //TODO: modificar l'endpoint in maniera coerente col backend
      .subscribe((d: Object)=> {
        console.log(d);
        //TODO: controllare se la registrazione è valida
        this.logUser=d;
      });
  }

  login(data: Object) {
    return this.backendComunication.post("users/login", data)  //TODO: modificar l'endpoint in maniera coerente col backend
      .subscribe((d: Object)=> {
        console.log(d);
        //TODO: controllare se il login è valido
        this.logUser=d;
        return true;
      });
  }

  logout(): void {
    this.logUser=undefined;
  }

  isLoggedIn(): boolean {
    this.checkCredentials();
    console.log(this.loggedUser);
    if(this.loggedUser) return true;
    else return false;
  }
}

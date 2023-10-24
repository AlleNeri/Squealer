import { Injectable } from '@angular/core';
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

interface ILoggedUser {
  user: IUser;
  jwt: Object;
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loggedUser?: Object;  //TODO: chenge this type to ILoggedUser and adjust all the related problems
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

  register(data: { user: IUser, password: string }) {
    return this.backendComunication.post("users/register", data)
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
    if(this.loggedUser) return true;
    else return false;
  }
}

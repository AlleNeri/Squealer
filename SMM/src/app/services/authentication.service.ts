import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { BackendComunicationService } from './backend-comunication.service';
import { IUser } from './user-information.service';

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
  private logInSubject: Subject<boolean>;

  constructor(private backendComunication: BackendComunicationService) {
    this.checkCredentials();
    this.logKey="user";
    this.logInSubject=new Subject<boolean>();
  }

  get logInObservable(): Observable<boolean> {
    return this.logInSubject.asObservable();
  }

  get userId(): string | null {
    if(this.loggedUser) return (this.loggedUser as any).id;
    else return null;
  }

  get token(): string | null {
    if(this.loggedUser) return (this.loggedUser as any).jwt.token;
    else return null;
  }

  //undefined argument to remove the user from the local storage(logout)
  private set logUser(obj: Object | undefined) {
    //this code emit also a new value to the observable
    this.loggedUser=obj;
    if(obj===undefined) {
      localStorage.removeItem(this.logKey);
      this.logInSubject.next(false);
    }
    else {
      localStorage.setItem(this.logKey, JSON.stringify(obj));
      this.logInSubject.next(true);
    }
  }

  checkCredentials() {
    const tmp=localStorage.getItem(this.logKey);
    if(tmp===null) this.loggedUser=undefined;
    else this.loggedUser=JSON.parse(tmp); //TODO: controllare se ci sono i campi utili
  }

  register(data: { user: IUser, password: string }) {
    return this.backendComunication.post("users/register", data)
      .subscribe((d: Object)=> {
        //TODO: controllare se la registrazione è valida
        this.logUser=d;
      });
  }

  login(data: Object) {
    return this.backendComunication.post("users/login", data)  //TODO: modificar l'endpoint in maniera coerente col backend
      .subscribe((d: Object)=> {
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

import { Injectable, Output, EventEmitter } from '@angular/core';

import { ILoggedUser, IRegisterBody } from '../interfaces/auth-user';

import { BackendComunicationService } from './backend-comunication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loggedUser?: ILoggedUser;
  private logKey: string;
  @Output() public logInEvent: EventEmitter<ILoggedUser>;

  constructor(private backendComunication: BackendComunicationService) {
    this.checkCredentials();
    this.logKey="user";
    this.logInEvent=new EventEmitter<ILoggedUser>();
    if(this.isLoggedIn()) this.logInEvent.emit(this.loggedUser!);
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
  private set logUser(obj: ILoggedUser | undefined) {
    this.loggedUser=obj;
    //set the local storage for persistency
    //this code emit also the event for the other components
    if(obj===undefined) localStorage.removeItem(this.logKey);
    else {
      localStorage.setItem(this.logKey, JSON.stringify(obj));
      this.logInEvent.emit(obj);
    }
  }

  checkCredentials() {
    const tmp=localStorage.getItem(this.logKey);
    if(tmp===null) this.loggedUser=undefined;
    else this.loggedUser=JSON.parse(tmp); //TODO: controllare se ci sono i campi utili
  }

  isTockenExpired(): boolean {
    if(this.loggedUser===undefined) return true;
    const exp=new Date(this.loggedUser.jwt.expires);
    return exp.getTime()<(new Date()).getTime();
  }

  register(data: IRegisterBody) {
    return this.backendComunication.post("users/register", data)
      .subscribe((d: Object)=> {
        if(this.isTockenExpired()) return false;
        this.logUser=d as ILoggedUser | undefined;
        return true;
      });
  }

  login(data: Object) {
    return this.backendComunication.post("users/login", data)
      .subscribe((d: Object)=> {
        if(this.isTockenExpired()) return false;
        this.logUser=d as ILoggedUser | undefined;
        return true;
      });
  }

  logout(): void {
    this.logUser=undefined;
  }

  isLoggedIn(): boolean {
    this.checkCredentials();
    if(this.isTockenExpired()) return false;
    if(this.loggedUser) return false;
    return true;
  }
}

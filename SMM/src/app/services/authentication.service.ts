import { Injectable, Output, EventEmitter } from '@angular/core';

import { ILoggedUser, IRegisterBody, ILoginBody, IChangePasswordBody, UserType } from '../interfaces/auth-user';

import { BackendComunicationService } from './backend-comunication.service';
import { mergeMap, of, map, catchError, throwError } from 'rxjs';

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
    if(this.loggedUser) return this.loggedUser.id;
    else return null;
  }

  get token(): string | null {
    if(this.loggedUser) return this.loggedUser.jwt.token;
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

  isTokenExpired(): boolean {
    if(this.loggedUser===undefined) return true;
    const exp=new Date(this.loggedUser.jwt.expires);
    const isExpired = exp.getTime()<(new Date()).getTime();
    if(isExpired) this.logout();
    return isExpired;
  }

  uploadImage(img: File, id?: string) {
    if(this.token) {
      const imageFormData = new FormData();
      imageFormData.append("image", img);
      if(id) imageFormData.append("id", id);
      return this.backendComunication.put(`media/image`, imageFormData, this.token);
    }
    return;
  }

  register(data: IRegisterBody, img: File | undefined) {
    return this.backendComunication.post("users/register", data)
      .pipe(mergeMap((d: Object)=> {
        this.logUser=d as ILoggedUser | undefined;
        if(this.isTokenExpired()) return of(null);
        if(this.token && img) return this.uploadImage(img)!;
        return of(null);
      }))
      .subscribe((d: Object | null)=> {
        if(d===null) return false;
        if(this.isTokenExpired()) return false;
        return true;
      });
  }

  login(data: ILoginBody) {
    return this.backendComunication.post("users/login", data)
      .pipe(
        map((d: any)=> {
          if(d.success) this.logUser=d as ILoggedUser | undefined;
          console.log(this.isTokenExpired());
          if(this.isTokenExpired()) return false;
          return true;
        }),
        catchError((e: any)=> throwError("e"))
      );
  }

  changePassword(data: IChangePasswordBody) {
    return this.backendComunication.put(`users/${this.loggedUser!.id}/changePassword`, data);
  }

  logout(): void {
    this.logUser=undefined;
  }

  isLoggedIn(): boolean {
    this.checkCredentials();
    if(!this.loggedUser) return false;
    if(this.isTokenExpired()) return false;
    return true;
  }

  get isSMM(): boolean {
    if(!this.isLoggedIn()) return false;
    return this.loggedUser!.userType === UserType.SMM;
  }
}

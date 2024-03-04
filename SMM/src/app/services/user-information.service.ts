import { Injectable, EventEmitter, Output } from '@angular/core';

import { IUser } from '../interfaces/user';
import { ILoggedUser } from '../interfaces/auth-user';

import Client from '../classes/client';

import { AuthenticationService } from './authentication.service';
import { BackendComunicationService } from './backend-comunication.service';

@Injectable({
  providedIn: 'root'
})
export class UserInformationService {
  private userInformation?: IUser;
  @Output() public userInformationEvent: EventEmitter<IUser>;
  private _client: Client[];

  constructor(private auth: AuthenticationService, private backendComunication: BackendComunicationService) {
    this._client=[];
    this.userInformationEvent=new EventEmitter<IUser>();
    this.auth.logInEvent.subscribe(async (loggedInUser: ILoggedUser)=>  this.getUserInfo(loggedInUser.id, loggedInUser.jwt.token));
    if(this.auth.isLoggedIn() && this.userInformation===undefined) this.getUserInfo(this.auth.userId!, this.auth.token!);
    this.userInformationEvent.subscribe((user: IUser)=> {
      this._client=[];
      if(user && user.client) {
        for(const c of user.client) {
          if(c) this.backendComunication.get(`users/${c}`, this.auth.token!)
            .subscribe((clientInfo: any)=> this._client.push(new Client(clientInfo as IUser)));
        }
      }
    });
  }

  public get user(): IUser | undefined {
    return this.userInformation;
  }

  private getUserInfo(user_id: string, user_token: string): void {
    this.backendComunication.get(`users/${user_id}`, user_token)
      .subscribe((d: Object)=> {
        this.userInformation=d as IUser;
        this.userInformationEvent.emit(this.userInformation);
      });
  }

  public get clients(): Client[] {
    return this._client;
  }

  public removeClient(clientId: string): void {
    this.backendComunication.delete(`users/clients/${clientId}`, this.auth.token!)
      .subscribe((d: any)=> {
        if(d.client) {
          console.log(d.client);
          this.userInformation!.client = d.client;
          this.userInformationEvent.emit(this.userInformation);
        }
      });
  }
}

export function factoryUserInformationService(userInformation: UserInformationService) {
  return ()=> userInformation.user;
}

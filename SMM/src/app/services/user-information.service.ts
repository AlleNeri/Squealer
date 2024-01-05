import { Injectable, EventEmitter, Output } from '@angular/core';

import IUser from '../interfaces/user';
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
  private _clients: Client[];

  constructor(private auth: AuthenticationService, private backendComunication: BackendComunicationService) {
    this._clients=[];
    this.userInformationEvent=new EventEmitter<IUser>();
    this.auth.logInEvent.subscribe(async (loggedInUser: ILoggedUser)=>  this.getUserInfo(loggedInUser.id, loggedInUser.jwt.token));
    if(this.auth.isLoggedIn() && this.userInformation===undefined) this.getUserInfo(this.auth.userId!, this.auth.token!);
    this.userInformationEvent.subscribe((user: IUser)=> {
      this._clients=[];
      if(user && user.friends) {
        for(const friend of user.friends) {
          if(friend) this.backendComunication.get(`users/${friend}`, this.auth.token!)
            .subscribe((clientInfo: any)=> this._clients.push(new Client(clientInfo as IUser)));
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
    return this._clients;
  }
}

export function factoryUserInformationService(userInformation: UserInformationService) {
  return ()=> userInformation.user;
}

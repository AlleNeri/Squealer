import { Injectable, EventEmitter, Output } from '@angular/core';

import { AuthenticationService, ILoggedUser } from './authentication.service';
import { BackendComunicationService } from './backend-comunication.service';

//TODO: spostare in un file apposito le definizioni tipi e interfacce
export interface IUser {
  _id?: string;
  id?: string;  //alias for _id
  u_name: string;
  name: {
    first: string;
    last: string;
  };
  email?: string;
  type?: string;
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
  @Output() public userInformationEvent: EventEmitter<IUser>;

  constructor(private auth: AuthenticationService, private backendComunication: BackendComunicationService) {
    this.userInformationEvent=new EventEmitter<IUser>();
    this.auth.logInEvent.subscribe(async (loggedInUser: ILoggedUser)=>  this.getUserInfo(loggedInUser));
  }

  public get user(): IUser | undefined {
    return this.userInformation;
  }

  private getUserInfo(user: ILoggedUser): void {
    this.backendComunication.get(`users/${user.id!}`, user.jwt.token)
      .subscribe((d: Object)=> {
        this.userInformation=d as IUser;
        this.userInformationEvent.emit(this.userInformation);
      });
  }

  get clients(): IUser[] {
    const result: IUser[]=[];
    if(this.userInformation && this.userInformation.friends) {
      for(const friend of this.userInformation.friends) {
        if(friend) this.backendComunication.get(`users/${friend}`, this.auth.token!)
          .subscribe((clientInfo: any)=> result.push(clientInfo as IUser));
      }
    }
    console.log(result);
    return result;
  }
}

export function factoryUserInformationService(userInformation: UserInformationService) {
  return ()=> userInformation.user;
}

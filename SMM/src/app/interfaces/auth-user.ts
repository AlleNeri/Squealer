import { IUser } from "./user";

export enum UserType {
	VIP='vip',
	MOD='mod',
	NORMAL='normal',
	SMM='smm',
	BOT='bot',
};

export interface IJWT {
  token: string;
  expires: string;
};

export interface ILoggedUser {
  id: string;
  jwt: IJWT;
  userType: UserType;
};

export interface ILoginBody {
  username: string,
  password: string
};

export interface IRegisterBody {
  user: IUser,
  password: string
};

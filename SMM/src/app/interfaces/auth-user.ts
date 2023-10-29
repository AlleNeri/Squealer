import IUser from "./user";

export interface IJWT {
  token: string;
  expires: string;
};

export interface ILoggedUser {
  id: string;
  jwt: IJWT;
};

export interface ILoginBody {
  username: string,
  password: string
};

export interface IRegisterBody {
  user: IUser,
  password: string
};

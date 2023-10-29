import IUser from "../interfaces/user"

export default class Client {
  private user?: IUser;

  constructor(user: IUser) {
    this.user=user;
  }

  public get id(): string | undefined {
    return this.user?._id;
  }

  public get username(): string | undefined {
    return this.user?.u_name;
  }
}

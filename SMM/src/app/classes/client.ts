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

  public get completeName(): string | undefined {
    return this.user?.name.first + " " + this.user?.name.last;
  }

  public get email(): string | undefined {
    return this.user?.email;
  }

  public get friendsNumber(): number | undefined {
    return this.user?.friends?.length;
  }
}

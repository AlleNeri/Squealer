import IUser, { IChar } from "../interfaces/user"

export default class Client {
  private user?: IUser;

  constructor(user: IUser) {
    this.user=user;
  }

  public get isThere(): boolean {
    return this.user !== undefined;
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

  public get image(): string | undefined {
    return this.user?.img;
  }

  public get charNumber(): IChar | undefined {
    return this.user?.char_availability!;
  }

  public get quoteNumber(): IChar | undefined {
    return this.user?.quote!;
  }
}

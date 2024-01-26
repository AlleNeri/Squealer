export default interface IUser {
  _id?: string;
  id?: string;  //alias for _id
  u_name: string;
  name: {
    first: string;
    last: string;
  };
  email?: string;
  type?: string;
  char_availability?: IChar;
  quote?: IChar;
  img?: string;
  b_date?: Date;
  appartenence?: string;
  smm?: string;
  client?: string[];
};

export interface IChar {
  dayly: number;
  weekly: number;
  monthly: number;
}

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
  char_availability?: number;
  img?: string; //TODO: look how to handle images
  b_date?: Date;
  appartenence?: string;
  friends?: string[];
};

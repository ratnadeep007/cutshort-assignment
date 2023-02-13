export interface IUserDoc extends Document {
  readonly username: string;
  readonly password: string;
}

export interface IUser {
  id: string;
  username: string;
  password: string;
}

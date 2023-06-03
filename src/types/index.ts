export interface IMessageGetParams {
  text: string;
  name: string;
  id: string;
  socketID: string;
}

export interface IUser {
  userName: string;
  socketID: string;
}

export interface ITyping {}

import { Time } from "@angular/common";

export interface loginDto {
  userName: string,
  password: string,
}
export interface Credentials {
  status:string;
  message: string;
  data: {
    id:any;
    email:string;
    name:string;
    profileImage:any;
    roles:string[];
  };
  token: string;
}

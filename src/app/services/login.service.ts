import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, LoginUser, NewUser } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private urlnovelsdb: string;


  constructor(private http: HttpClient) {
    this.urlnovelsdb = '/api';
  }

  login(user: LoginUser) {
    const url = `${ this.urlnovelsdb }/login`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true
    };
    return this.http.post(url, user, httpOptions);
  }

  resetPasswordRequest(userEmail: string) {
    const body = {
      user_email: userEmail
    };
    const url = `${ this.urlnovelsdb }/api/password-reset-request`;
    return this.http.post(url, body);
  }

  userRegister(user: NewUser) {
    const url = `${ this.urlnovelsdb }/api/create-user`;
    console.log(user);
    return this.http.post(url, user);
  }
}

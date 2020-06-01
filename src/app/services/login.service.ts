import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private urlnovelsdb: string;


  constructor(private http: HttpClient) {
    this.urlnovelsdb = '/api';
  }

  login(user: any) {
    const url = `${ this.urlnovelsdb }/login`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true
    };
    return this.http.post(url, user, httpOptions);
  }

  getUserData(id: string) {
    const url = `${ this.urlnovelsdb }/api/user/${id}`;
    console.log(url);

    return this.http.get( url );
  }

  getUserSelfData(jwt: any, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/self-service-user/${id}`;
    console.log(url);

    return this.http.get(url, httpOptions);
  }

  updateUser(jwt: string, user: User, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/update-user/${id}`;
    console.log(url);

    return this.http.put(url , user, httpOptions);
  }

  resetPasswordRequest(user: any) {
    const url = `${ this.urlnovelsdb }/api/user/password-reset`;
    console.log(user);
    return this.http.post(url, user);
  }

  userRegister(user: any) {
    const url = `${ this.urlnovelsdb }/api/create-user`;
    console.log(user);
    return this.http.post(url, user);
  }
}

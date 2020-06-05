import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Novel, User, Invitation, LoginUser, NewUser } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private urlnovelsdb: string;
  private GlobalhttpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) {
    this.urlnovelsdb = '/api';
  }

  getUserLoged() {
    const Localtoken = localStorage.getItem('sknvl_s');
    if (Localtoken) {
      const jwtData = Localtoken.split('.')[1];
      if (window.atob(jwtData)) {
        const decodedJwtJsonData = window.atob(jwtData);
        const decodedJwtData = JSON.parse(decodedJwtJsonData);
        if (decodedJwtData.sub) {
          const user: User = {
            id: decodedJwtData.sub,
            user_forum_auth: decodedJwtData.user_forum_auth,
            user_login: decodedJwtData.user_login,
            user_profile_image: decodedJwtData.user_profile_image,
            token: Localtoken
          };
          return user;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  userIsLoged() {
    const token = localStorage.getItem('sknvl_s');
    if (token) {
      const jwtData = token.split('.')[1];
      if (window.atob(jwtData)) {
        const decodedJwtJsonData = window.atob(jwtData);
        const decodedJwtData = JSON.parse(decodedJwtJsonData);
        if (decodedJwtData.sub) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  userIsEditor() {
    const token = localStorage.getItem('sknvl_s');
    if (token) {
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      if (decodedJwtData.user_rol === 'Admin' || decodedJwtData.user_rol === 'Editor') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  logIn(user: LoginUser) {
    const url = `${ this.urlnovelsdb }/login`;
    return this.http.post(url, user, this.GlobalhttpOptions);
  }

  logOut() {
    const url = `${ this.urlnovelsdb }/logout`;
    return this.http.get(url, this.GlobalhttpOptions);
  }

  createUser(user: NewUser) {
    const url = `${ this.urlnovelsdb }/create-user`;
    console.log(user);
    return this.http.post(url, user);
  }

  getUser(id: number) {
    const url = `${ this.urlnovelsdb }/user/${id}`;
    return this.http.get(url);
  }

  getUserNovels() {
    const url = `${ this.urlnovelsdb }/user-novels`;
    return this.http.get(url, this.GlobalhttpOptions);
  }

  updateUser(user: User) {
    const url = `${this.urlnovelsdb}/update-user`;
    return this.http.put(url, user, this.GlobalhttpOptions);
  }

  passwordResetRequest(email: string) {
    const url = `${ this.urlnovelsdb}/password-reset-request`;
    return this.http.post(url, email);
  }

  passwordReset(password: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };
    const url = `${ this.urlnovelsdb}/password-reset-request`;
    return this.http.post(url, password, httpOptions);
  }

  getUserBookmarks() {
    const url = `${ this.urlnovelsdb }/get-user-bookmarks`;
    return this.http.get(url);
  }

  createUserBookmark(nvlId: number) {
    const url = `${this.urlnovelsdb}/create-user-bookmark`;
    const bookmark = {
      nvl_id: nvlId,
    };
    return this.http.post(url, bookmark, this.GlobalhttpOptions);
  }

  updateUserBookmark(bookmark: any) {
    const url = `${this.urlnovelsdb}/update-user-bookmark`;
    return this.http.put(url, bookmark, this.GlobalhttpOptions);
  }

  deleteUserBoomark(id: number) {
    const url = `${ this.urlnovelsdb }/delete-user-bookmark/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }

  activateUser(key: string) {
    const url = `${this.urlnovelsdb}/activate-user/${key}`;
    return this.http.get(url);
  }

  getUserImage(userProfileImage: string) {
    const url = `${ this.urlnovelsdb }/user-profile-img/${userProfileImage}/false`;
    return this.http.get( url, {responseType: 'blob'});
  }

  getUserInvitations() {
    const url = `${ this.urlnovelsdb }/get-user-invitations`;
    return this.http.get( url );
  }

  sendInvitation(userLogin: string, novelId: number) {
    const invitation: Invitation = {
      user_login: userLogin,
      invitation_novel: novelId
    };
    console.log(invitation);
    const url = `${ this.urlnovelsdb }/create-user-invitation`;
    return this.http.post(url, invitation, this.GlobalhttpOptions);
  }

  updateUserInvitation(invitation: Invitation) {
    const url = `${ this.urlnovelsdb }/update-user-invitation`;
    return this.http.put(url , invitation, this.GlobalhttpOptions);
  }
}

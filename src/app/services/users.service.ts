import { Injectable, Inject, PLATFORM_ID, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, Invitation, LoginUser, NewUser, Bookmark } from '../models/models';
import { Dev, Prod } from '../config/config';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private urlNovelsDb: string;
  private urlCredentialsNovelsDb: string;
  isBrowser: boolean;
  private GlobalhttpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient,
              private dev: Dev,
              private prod: Prod,
              @Inject(PLATFORM_ID) private platformId) {

              this.isBrowser = isPlatformBrowser(this.platformId);
              if (isDevMode()) {
                this.urlCredentialsNovelsDb = this.dev.urlCredentialsNovelsDb;
                this.urlNovelsDb = this.dev.urlNovelsDb;
              } else {
                this.urlCredentialsNovelsDb = this.prod.urlCredentialsNovelsDb;
                this.urlNovelsDb = this.prod.urlNovelsDb;
              }
  }

  getUserLoged() {
    if (this.isBrowser) {
      const Localtoken = localStorage.getItem('sknvl_s');
      if (Localtoken) {
        const tmp = Localtoken.split('');
        tmp.splice(46, 1);
        const jwtData = tmp.join('').split('.')[1];
        if (JSON.parse(atob(jwtData))) {
            const decodedJwtData = JSON.parse(atob(jwtData));
            const user: User = {
              id: decodedJwtData.sub,
              user_forum_auth: decodedJwtData.user_forum_auth,
              user_login: decodedJwtData.user_login,
              image: decodedJwtData.image,
              token: tmp.join('')
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
    if (this.isBrowser) {
      const token = localStorage.getItem('sknvl_s');
      if (token) {
        const tmp = token.split('');
        tmp.splice(46, 1);
        const jwtData = tmp.join('').split('.')[1];
        if (JSON.parse(atob(jwtData))) {
          const decodedJwtData = JSON.parse(atob(jwtData));
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
    } else {
      return false;
    }
  }

  userIsEditor() {
    if (this.isBrowser) {
      const token = localStorage.getItem('sknvl_s');
      if (token) {
        const tmp = token.split('');
        tmp.splice(46, 1);
        const jwtData = tmp.join('').split('.')[1];
        const decodedJwtData = JSON.parse(atob(jwtData));
        if (decodedJwtData.user_rol === 'Admin' || decodedJwtData.user_rol === 'Editor') {
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

  logIn(user: LoginUser) {
    const url = `${ this.urlCredentialsNovelsDb }/login`;
    return this.http.post(url, user, this.GlobalhttpOptions);
  }

  logOut() {
    const url = `${ this.urlCredentialsNovelsDb }/logout`;
    return this.http.get(url, this.GlobalhttpOptions);
  }

  createUser(user: NewUser) {
    const url = `${ this.urlNovelsDb }/create-user`;
    return this.http.post(url, user);
  }

  getUser(id: number) {
    const url = `${ this.urlNovelsDb }/user/${id}`;
    return this.http.get(url);
  }

  getUserNovels() {
    const url = `${ this.urlCredentialsNovelsDb }/user-novels`;
    return this.http.get(url, this.GlobalhttpOptions);
  }

  updateUser(user: User) {
    const url = `${this.urlCredentialsNovelsDb}/update-user`;
    return this.http.put(url, user, this.GlobalhttpOptions);
  }

  passwordResetRequest(email: string) {
    const body = {
      user_email: email
    };
    const url = `${ this.urlNovelsDb}/password-reset-request`;
    return this.http.post(url, body);
  }

  passwordResetAccess(token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };
    const url = `${ this.urlNovelsDb}/password-reset-access`;
    return this.http.get(url, httpOptions);
  }

  updateUserPassword(password: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };
    const body = {
      user_pass: password
    };
    const url = `${ this.urlNovelsDb}/password-reset`;
    return this.http.post(url, body, httpOptions);
  }

  getUserBookmarks() {
    const url = `${ this.urlCredentialsNovelsDb }/get-user-bookmarks`;
    return this.http.get(url, this.GlobalhttpOptions);
  }

  createUserBookmark(nvlId: number, chpId: number) {
    const url = `${this.urlCredentialsNovelsDb}/create-user-bookmark`;
    const bookmark: Bookmark = {
      nvl_id: nvlId,
      chp_id: chpId
    };
    return this.http.post(url, bookmark, this.GlobalhttpOptions);
  }

  updateUserBookmark(bookmark: Bookmark) {
    const url = `${this.urlCredentialsNovelsDb}/update-user-bookmark`;
    return this.http.put(url, bookmark, this.GlobalhttpOptions);
  }

  deleteUserBoomark(id: number) {
    const url = `${ this.urlCredentialsNovelsDb }/delete-user-bookmark/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }

  activateUser(userKey: string) {
    const url = `${this.urlNovelsDb}/activate-user`;
    const body = {
      key: userKey
    };
    return this.http.post(url, body);
  }

  getUserInvitations() {
    const url = `${ this.urlCredentialsNovelsDb }/get-user-invitations`;
    return this.http.get( url, this.GlobalhttpOptions );
  }

  sendInvitation(userLogin: string, novelId: number) {
    const invitation: Invitation = {
      user_login: userLogin,
      invitation_novel: novelId
    };
    const url = `${ this.urlCredentialsNovelsDb }/create-user-invitation`;
    return this.http.post(url, invitation, this.GlobalhttpOptions);
  }

  updateUserInvitation(invitation: Invitation) {
    const url = `${ this.urlCredentialsNovelsDb }/update-user-invitation`;
    return this.http.put(url , invitation, this.GlobalhttpOptions);
  }
}

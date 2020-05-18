import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HelperService } from './helper.service';
import { PostComment } from '../models/post-comment';
import { User } from '../models/models';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private urlnovelsdb: string;

  constructor(private http: HttpClient,
              private hs: HelperService) {
    this.urlnovelsdb = '/api';
  }

  userIsAdmin() {
    const token = localStorage.getItem('sknvl_s');
    if (token) {
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      if (decodedJwtData.user_rol === 'Admin') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  adminCreateGenre(jwt: string, genre: any) {
    console.log(genre);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb }/create-genre`;
    console.log(url);
    return this.http.post(url, genre, httpOptions);
  }

  adminUpdateGenre(jwt: string, genre: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb }/update-genre`;
    console.log(genre);
    return this.http.put(url , genre, httpOptions);
  }

  adminDeleteGenre(jwt: string, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb }/delete-genre/${id}`;
    return this.http.delete(url, httpOptions);
  }

  adminGetUsers(jwt: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-users`;
    console.log(url);
    return this.http.get(url, httpOptions);
  }

  adminGetUser(jwt: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-user/${id}`;
    console.log(url);
    return this.http.get(url, httpOptions);
  }

  adminUpdateUser(jwt: string, user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb }/admin-update-user`;
    return this.http.put(url , user, httpOptions);
  }

  adminDeleteUser(jwt: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };

    const url = `${ this.urlnovelsdb }/admin-delete-user/${id}`;
    return this.http.delete(url, httpOptions);
  }

  adminGetForumPosts(jwt: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-get-forum-posts`;
    console.log(url);
    return this.http.get(url, httpOptions);
  }

  adminUpdateForumPost(jwt: string, post: any) {
    const url = `${ this.urlnovelsdb }/admin-update-forum-post`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    return this.http.put(url , post, httpOptions);
  }

  adminDeleteForumPost(jwt: string, id: string) {
    const url = `${this.urlnovelsdb}/admin-delete-forum-post/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    return this.http.delete(url , httpOptions);
  }

  adminDeletePostComment(jwt: string, id: string) {
    const url = `${this.urlnovelsdb}/admin-delete-post-comment/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    return this.http.delete(url , httpOptions);
  }

  adminUpdatePostComment(jwt: string, postComment: PostComment) {
    const url = `${ this.urlnovelsdb }/admin-update-post-comment`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    return this.http.put(url , postComment, httpOptions);
  }

  adminGetCategories(jwt: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-get-categories`;
    console.log(url);
    return this.http.get(url, httpOptions);
  }

  adminCreateCategory(jwt: string, category: any) {
    const url = `${ this.urlnovelsdb }/admin-create-forum-category`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    console.log(url);
    return this.http.post(url, category, httpOptions);
  }

  adminUpdateCategory(jwt: string, category: any) {
    const url = `${ this.urlnovelsdb }/admin-update-forum-category`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    return this.http.put(url , category, httpOptions);
  }

  adminDeleteCategory(jwt: string, id: string) {
    const url = `${this.urlnovelsdb}/admin-delete-forum-category/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    return this.http.delete(url , httpOptions);
  }

  adminPanelAccess(jwt: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true,
    };
    const url = `${ this.urlnovelsdb }/admin-panel`;
    return this.http.get(url, httpOptions);
  }

  adminPanelErrorHandler(error?: any, login?: boolean) {
    if ((error && error.status === 401) || login) {
        this.hs.openExternalFunction('loginForm');
    }
    if (error.status === 500) {
      return error.error.message;
    }
  }
}

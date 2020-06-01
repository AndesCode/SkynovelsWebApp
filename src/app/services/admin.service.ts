import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HelperService } from './helper.service';
import { PostComment } from '../models/post-comment';
import { User, Novel, Genre, Advertisement } from '../models/models';
import { Volume } from '../models/volume';
import { Chapter } from '../models/chapter';

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

  adminCreateGenre(jwt: string, genre: Genre) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb }/admin-create-genre`;
    return this.http.post(url, genre, httpOptions);
  }

  adminUpdateGenre(jwt: string, genre: Genre) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb }/admin-update-genre`;
    console.log(genre);
    return this.http.put(url , genre, httpOptions);
  }

  adminDeleteGenre(jwt: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb }/admin-delete-genre/${id}`;
    return this.http.delete(url, httpOptions);
  }

  adminGetNovel(jwt: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-novel/${id}`;
    console.log(url);
    return this.http.get(url, httpOptions);
  }


  adminGetNovels(jwt: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-novels`;
    console.log(url);
    return this.http.get(url, httpOptions);
  }

  adminUpdateNovel(jwt: string, novel: Novel) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-update-novel`;
    return this.http.put(url, novel, httpOptions);
  }

  adminDeleteNovel(jwt: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-delete-novel/${id}`;
    return this.http.delete(url, httpOptions);
  }

  adminUpdateVolume(jwt: string, volume: Volume) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-update-volume`;
    return this.http.put(url, volume, httpOptions);
  }

  adminDeleteVolume(jwt: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-delete-volume/${id}`;
    return this.http.delete(url, httpOptions);
  }

  adminGetChapter(jwt: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-get-chapter/${id}`;
    console.log(url);
    return this.http.get(url, httpOptions);
  }

  adminUpdateChapter(jwt: string, chapter: Chapter) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-update-chapters`;
    return this.http.put(url, chapter, httpOptions);
  }

  adminDeleteChapter(jwt: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb}/admin-delete-chapter/${id}`;
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

  adminGetAdvertisements(jwt: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true,
    };
    const url = `${ this.urlnovelsdb }/admin-get-advertisements`;
    return this.http.get(url, httpOptions);
  }

  adminGetAdvertisement(jwt: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true,
    };
    const url = `${ this.urlnovelsdb }/admin-get-advertisement/${id}`;
    return this.http.get(url, httpOptions);
  }

  adminCreateAdvertisement(jwt: string, advertisement: Advertisement) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb }/admin-create-advertisement`;
    return this.http.post(url, advertisement, httpOptions);
  }

  adminUpdateAdvertisement(jwt: string, advertisement: Advertisement) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb }/admin-update-advertisement`;
    return this.http.put(url , advertisement, httpOptions);
  }

  adminDeleteAdvertisement(jwt: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb }/admin-delete-advertisement/${id}`;
    return this.http.delete(url, httpOptions);
  }

  adminCreateRecommnededNovel(jwt: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: jwt
      }),
      withCredentials: true
    };
    const url = `${ this.urlnovelsdb }/admin-create-recommended-novel/${id}`;
    return this.http.post(url, null, httpOptions);
  }

  AdminUploadImage(jwt: string, id: number, file: File, img: string) {
    console.log(id);
    const url = `${ this.urlnovelsdb }/admin-upload-advertisement-img/${id}`;
    const appendType = 'advertisement_image';
    const oldAppendType = 'old_advertisement_image';
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      formData.append(appendType, file, file.name);
      if (img && img !== undefined &&  img !== null && img.length > 0) {
        formData.append(oldAppendType, img);
      }
      xhr.withCredentials = true;
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', jwt);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            return resolve(JSON.parse(xhr.response));
          } else {
            return reject(JSON.parse(xhr.response));
          }
        }
      };
    });
  }
}

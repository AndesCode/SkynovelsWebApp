import { Injectable, isDevMode  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Like, User } from '../models/models';
import { Dev, Prod } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  private urlCredentialsNovelsDb: string;
  private GlobalhttpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient,
              private dev: Dev,
              private prod: Prod) {
                if (isDevMode()) {
                  this.urlCredentialsNovelsDb = this.dev.urlCredentialsNovelsDb;
                } else {
                  this.urlCredentialsNovelsDb = this.prod.urlCredentialsNovelsDb;
                }
  }

  switchLike(user: User, object: any, objectType: 'adv_id' | 'novel_rating_id' | 'comment_id' | 'reply_id') {
    if (user) {
      if (object.liked === false) {
        object.liked = true;
        const like: Like = {
          [objectType]: object.id
        };
        this.createLike(like).subscribe((data: any) => {
          object.like_id = data.like.id;
          object.likes.push(data.like);
        }, error => {
          object.liked = false;
        });
      } else {
        object.liked = false;
        this.deleteLike(object.like_id).subscribe((data: any) => {
          object.likes.splice(object.likes.findIndex(x => x.id === object.like_id), 1);
          object.like_id = null;
        }, error => {
          object.liked = true;
        });
      }
    } else {
      return;
    }
  }

  createLike(like: Like) {
    const url = `${ this.urlCredentialsNovelsDb }/create-like`;
    return this.http.post(url, like, this.GlobalhttpOptions);
  }

  deleteLike(id: number) {
    const url = `${this.urlCredentialsNovelsDb}/delete-like/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }
}

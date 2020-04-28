import { Injectable, EventEmitter  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Novel } from '../models/models';
import { Chapter } from '../models/chapter';
import { Post } from '../models/post';
import { PostComment } from '../models/post-comment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

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

  getForumCategories()  {
    const url = `${ this.urlnovelsdb}/forum-categories`;
    return this.http.get( url );
  }

  getForumCategory(category: string) {
  const url = `${this.urlnovelsdb}/forum-category/${category}`;
  console.log(url);
  return this.http.get( url );
}

  getForumPost(id: any) {
    const url = `${ this.urlnovelsdb}/forum-post/${id}`;
    console.log(url);
    return this.http.get(url, this.GlobalhttpOptions);
  }

  createForumPost(post: Post) {
    const url = `${ this.urlnovelsdb }/create-forum-post`;
    console.log(url);
    return this.http.post(url, post, this.GlobalhttpOptions);
  }

  updateForumPost(post: Post) {
    const url = `${ this.urlnovelsdb }/update-forum-post`;
    console.log(url);

    return this.http.put(url , post, this.GlobalhttpOptions);
  }

  deleteForumPost(id: string) {
    const url = `${this.urlnovelsdb}/delete-forum-post/${id}`;
    return this.http.delete(url , this.GlobalhttpOptions);
  }

  createComment(postComment: PostComment) {
    const url = `${this.urlnovelsdb}/create-post-comment`;
    return this.http.post(url, postComment, this.GlobalhttpOptions);
  }

  updatePostComment (postComment: PostComment) {
    const url = `${this.urlnovelsdb}/update-post-comment`;
    return this.http.put(url , postComment, this.GlobalhttpOptions);
  }

  deleteComment (id: string) {
    const url = `${this.urlnovelsdb}/delete-post-comment/${id}`;
    return this.http.delete(url , this.GlobalhttpOptions);
  }
}

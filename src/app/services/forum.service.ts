import { Injectable, isDevMode  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from '../models/post';
import { PostComment } from '../models/post-comment';
import { Dev, Prod } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  private urlNovelsDb: string;
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
      this.urlNovelsDb = this.dev.urlNovelsDb;
    } else {
      this.urlCredentialsNovelsDb = this.prod.urlCredentialsNovelsDb;
      this.urlNovelsDb = this.prod.urlNovelsDb;
    }
  }

  getForumCategories()  {
    const url = `${ this.urlNovelsDb}/forum-categories`;
    return this.http.get( url );
  }

  getForumCategory(category: string) {
  const url = `${this.urlNovelsDb}/forum-category/${category}`;
  console.log(url);
  return this.http.get( url );
}

  getForumPost(id: any) {
    const url = `${ this.urlNovelsDb}/forum-post/${id}`;
    console.log(url);
    return this.http.get(url, this.GlobalhttpOptions);
  }

  createForumPost(post: Post) {
    const url = `${ this.urlNovelsDb }/create-forum-post`;
    console.log(url);
    return this.http.post(url, post, this.GlobalhttpOptions);
  }

  updateForumPost(post: Post) {
    const url = `${ this.urlNovelsDb }/update-forum-post`;
    console.log(url);

    return this.http.put(url , post, this.GlobalhttpOptions);
  }

  deleteForumPost(id: string) {
    const url = `${this.urlNovelsDb}/delete-forum-post/${id}`;
    return this.http.delete(url , this.GlobalhttpOptions);
  }

  createComment(postComment: PostComment) {
    const url = `${this.urlNovelsDb}/create-post-comment`;
    return this.http.post(url, postComment, this.GlobalhttpOptions);
  }

  updatePostComment(postComment: PostComment) {
    const url = `${this.urlNovelsDb}/update-post-comment`;
    return this.http.put(url , postComment, this.GlobalhttpOptions);
  }

  deleteComment (id: string) {
    const url = `${this.urlNovelsDb}/delete-post-comment/${id}`;
    return this.http.delete(url , this.GlobalhttpOptions);
  }
}

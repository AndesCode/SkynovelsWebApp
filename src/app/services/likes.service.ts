import { Injectable  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LikesService {

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

  createNovelRatingLike(novel_rating_id: any) {
    const like = {
      novel_rating_id: novel_rating_id
    };
    const url = `${ this.urlnovelsdb }/create-novel-rating-like`;
    console.log(url);
    return this.http.post(url, like, this.GlobalhttpOptions);
  }

  deleteNovelRatingLike(id: string) {
    const url = `${this.urlnovelsdb}/delete-novel-rating-like/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }

  createNovelRatingCommentLike(novel_rating_comment_id: any) {
    const like = {
      novel_rating_comment_id: novel_rating_comment_id
    };
    const url = `${ this.urlnovelsdb }/create-novel-rating-comment-like`;
    console.log(url);
    return this.http.post(url, like, this.GlobalhttpOptions);
  }

  deleteNovelRatingCommentLike(id: string) {
    const url = `${this.urlnovelsdb}/delete-novel-rating-comment-like/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }
}

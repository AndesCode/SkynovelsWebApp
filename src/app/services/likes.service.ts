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

  createNovelRatingLike(novelRatingId: any) {
    const like = {
      novel_rating_id: novelRatingId
    };
    const url = `${ this.urlnovelsdb }/create-novel-rating-like`;
    console.log(url);
    return this.http.post(url, like, this.GlobalhttpOptions);
  }

  deleteNovelRatingLike(id: number) {
    const url = `${this.urlnovelsdb}/delete-novel-rating-like/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }

  createNovelRatingCommentLike(novelRatingCommentId: any) {
    const like = {
      novel_rating_comment_id: novelRatingCommentId
    };
    const url = `${ this.urlnovelsdb }/create-novel-rating-comment-like`;
    console.log(url);
    return this.http.post(url, like, this.GlobalhttpOptions);
  }

  deleteNovelRatingCommentLike(id: number) {
    const url = `${this.urlnovelsdb}/delete-novel-rating-comment-like/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }

  createChapterCommentLike(chapterCommentId: any) {
    const like = {
      chapter_comment_id: chapterCommentId
    };
    const url = `${ this.urlnovelsdb }/create-chapter-comment-like`;
    console.log(url);
    return this.http.post(url, like, this.GlobalhttpOptions);
  }

  deleteChapterCommentLike(id: number) {
    const url = `${this.urlnovelsdb}/delete-chapter-comment-like/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }

  createChapterCommentReplyLike(chapterCommentReplyId: any) {
    const like = {
      chapter_comment_reply_id: chapterCommentReplyId
    };
    const url = `${ this.urlnovelsdb }/create-chapter-comment-reply-like`;
    console.log(url);
    return this.http.post(url, like, this.GlobalhttpOptions);
  }

  deleteChapterCommentReplyLike(id: number) {
    const url = `${this.urlnovelsdb}/delete-chapter-comment-reply-like/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }
}

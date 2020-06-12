import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reply, Comment, User, Like } from '../models/models';
import { HelperService } from './helper.service';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  private urlnovelsdb: string;
  private GlobalhttpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient,
              private hs: HelperService) {
    this.urlnovelsdb = '/api';
  }

  createCommentFunction(user: User, object: any, objectType: 'chp_id' | 'adv_id') {
    const comment: Comment = {
      [objectType]: object.id,
      comment_content: object.comment
    };
    this.createComment(comment).subscribe((data: any) => {
      data.comment.user_login = user.user_login;
      data.comment.user_profile_image = user.user_profile_image;
      data.comment.liked = false;
      data.comment.show_more = false;
      data.comment.edition = false;
      data.comment.likes = [];
      data.comment.replys = [];
      data.comment.show_replys = false;
      data.comment.reply = null;
      data.comment.date_data = this.hs.getRelativeTime(data.comment.createdAt);
      object.comments.push(data.comment);
      object.comment = null;
    });
  }

  updateCommentFunction(form: NgForm, comment: Comment) {
    if (form.dirty) {
      if (form.valid) {
        this.updateComment(comment).subscribe((data: any) => {
          comment.edition = false;
        });
      } else {
        comment.edition = false;
      }
    } else {
      comment.edition = false;
    }
  }

  deleteCommentFunction(object: any, comment: Comment) {
    this.deleteComment(comment.id).subscribe((data: any) => {
      object.comments.splice(object.comments.findIndex(x => x.id === comment.id), 1);
    });
  }

  createReplyFunction(user: User, object: any, objectType: 'comment_id' | 'novel_rating_id') {
    const reply: Reply = {
      [objectType]: object.id,
      reply_content: object.reply
    };
    this.createReply(reply).subscribe((data: any) => {
      data.reply.user_login = user.user_login;
      data.reply.user_profile_image = user.user_profile_image;
      data.reply.liked = false;
      data.reply.show_more = false;
      data.reply.edition = false;
      data.reply.likes = [];
      data.reply.date_data = this.hs.getRelativeTime(data.reply.createdAt);
      object.replys.unshift(data.reply);
      object.reply = null;
    });
  }

  getReplysFunction(user: User, object: any, objectType: 'comment_id' | 'novel_rating_id') {
    if (object.replys.length > 0) {
      object.show_replys = true;
    } else {
      this.getReplys(object.id, objectType).subscribe((data: any) => {
        object.replys = data.replys;
        for (const reply of object.replys) {
          reply.liked = false;
          reply.show_more = false;
          reply.edition = false;
          reply.date_data = this.hs.getRelativeTime(reply.createdAt);
          if (user) {
            for (const replyLike of reply.likes) {
              if (replyLike.user_id === user.id) {
                reply.liked = true;
                reply.like_id = replyLike.id;
                break;
              }
            }
          }
        }
        object.show_replys = true;
        object.replys.sort(this.hs.dateDataSorter);
      });
    }
  }

  hideReplys(element: any) {
    element.show_replys = false;
  }

  updateReplyFunction(form: NgForm, reply: Reply) {
    if (form.dirty) {
      if (form.valid) {
        this.updateReply(reply).subscribe((data: any) => {
          reply.edition = false;
        });
      } else {
        reply.edition = false;
      }
    } else {
      reply.edition = false;
    }
  }

  deleteReplyFunction(object: any, reply: Reply) {
    this.deleteReply(reply.id).subscribe((data: any) => {
      object.replys.splice(object.replys.findIndex(x => x.id === reply.id), 1);
    });
  }

  setEdition(element: any) {
    element.edition = true;
  }

  setContent(content: string, length: number) {
    return content.length > length ? (content).substring(0, length) + '...' : content;
  }

  showMore(object) {
    if (object.show_more === true) {
      object.show_more = false;
    } else {
      object.show_more = true;
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
    const url = `${ this.urlnovelsdb }/create-like`;
    return this.http.post(url, like, this.GlobalhttpOptions);
  }

  deleteLike(id: number) {
    const url = `${this.urlnovelsdb}/delete-like/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }

  getAdvertisements() {
    const url = `${ this.urlnovelsdb }/get-advertisements`;
    return this.http.get( url );
  }

  getAdvertisement(id: number) {
    const url = `${ this.urlnovelsdb }/get-advertisement/${id}`;
    return this.http.get( url );
  }

  createComment(comment: Comment) {
    const url = `${ this.urlnovelsdb }/create-comment`;
    return this.http.post(url, comment, this.GlobalhttpOptions);
  }

  getComments(id: number, objectType: string) {
    const url = `${ this.urlnovelsdb }/get-comments/${id}/${objectType}`;
    return this.http.get( url );
  }

  updateComment(comment: Comment) {
    const url = `${ this.urlnovelsdb }/update-comment`;
    return this.http.put(url , comment, this.GlobalhttpOptions);
  }

  deleteComment(id: number) {
    const url = `${ this.urlnovelsdb }/delete-comment/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }

  createReply(reply: Reply) {
    const url = `${ this.urlnovelsdb }/create-reply`;
    return this.http.post(url, reply, this.GlobalhttpOptions);
  }

  getReplys(id: number, objectType: string) {
    const url = `${ this.urlnovelsdb }/get-replys/${id}/${objectType}`;
    return this.http.get( url );
  }

  updateReply(reply: Reply) {
    const url = `${ this.urlnovelsdb }/update-reply`;
    return this.http.put(url , reply, this.GlobalhttpOptions);
  }

  deleteReply(id: number) {
    const url = `${ this.urlnovelsdb }/delete-reply/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }
}

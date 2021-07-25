import { Inject, Injectable, isDevMode, PLATFORM_ID, TemplateRef  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reply, Comment, User, Like } from '../models/models';
import { HelperService } from './helper.service';
import { NgForm } from '@angular/forms';
import { Dev, Prod } from '../config/config';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PageService {


  bottomSheetOpened: boolean;
  isBrowser: boolean;
  private urlNovelsDb: string;
  private urlCredentialsNovelsDb: string;
  private GlobalhttpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient,
              private hs: HelperService,
              private dev: Dev,
              private prod: Prod,
              private dialog: MatDialog,
              private matSnackBar: MatSnackBar,
              private bottomSheet: MatBottomSheet,
              private activatedRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private platformId) {
                if (isDevMode()) {
                  this.urlCredentialsNovelsDb = this.dev.urlCredentialsNovelsDb;
                  this.urlNovelsDb = this.dev.urlNovelsDb;
                } else {
                  this.urlCredentialsNovelsDb = this.prod.urlCredentialsNovelsDb;
                  this.urlNovelsDb = this.prod.urlNovelsDb;
                }
                this.isBrowser = isPlatformBrowser(this.platformId);
  }

  openDialogSheet(template: TemplateRef<any>): void {
    this.dialog.open(template, {
      closeOnNavigation: false
    });
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  openBottomSheet(template: TemplateRef<any>): void {
    this.bottomSheetOpened = true;
    const bottomSheet = this.bottomSheet.open(template, {
      closeOnNavigation: false
    });
    bottomSheet.backdropClick().subscribe(() => {
      this.bottomSheetDismiss();
    });
  }

  bottomSheetDismiss() {
    this.bottomSheetOpened = false;
    this.bottomSheet.dismiss();
  }

  dialogCloseAll() {
    this.dialog.closeAll();
  }

  matSnackBarDismiss() {
    this.matSnackBar.dismiss();
  }

  getBottomSheetState() {
    return this.bottomSheetOpened
  }

  createCommentFunction(user: User, object: any, objectType: 'chp_id' | 'adv_id') {
    const comment: Comment = {
      [objectType]: object.id,
      comment_content: object.comment
    };
    if (comment.comment_content && comment.comment_content.length > 1) {
      this.createComment(comment).subscribe((data: any) => {
        data.comment.user_login = user.user_login;
        data.comment.image = user.image;
        data.comment.liked = false;
        data.comment.show_more = false;
        data.comment.edition = false;
        data.comment.likes = [];
        data.comment.replys = [];
        data.comment.show_replys = false;
        data.comment.reply = null;
        data.comment.replys_count = 0;
        data.comment.date_data = this.hs.getRelativeTime(data.comment.createdAt);
        object.comments.push(data.comment);
        object.comment = null;
      });
    } else {
      return;
    }
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
    if (reply.reply_content && reply.reply_content.length > 1) {
      this.createReply(reply).subscribe((data: any) => {
        data.reply.user_login = user.user_login;
        data.reply.image = user.image;
        data.reply.liked = false;
        data.reply.show_more = false;
        data.reply.edition = false;
        data.reply.likes = [];
        data.reply.date_data = this.hs.getRelativeTime(data.reply.createdAt);
        object.replys.unshift(data.reply);
        object.reply = null;
        object.replys_count = Number(object.replys_count) + 1;
      });
    } else {
      return;
    }
  }

  getReplysFunction(user: User, object: any, objectType: 'comment_id' | 'novel_rating_id', scrollToHTMLElement?: any) {
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
        if (scrollToHTMLElement) {
          this.scrollToHTMLElement(null, scrollToHTMLElement)
        }
      });
    }
  }

  scrollToHTMLElement(element: HTMLElement, htmlElementId: string) {
    if (this.isBrowser) {
      setTimeout(() => {
        if (element) {
          element.scrollIntoView();
          return;
        }
        if (htmlElementId) {
          const element = document.getElementById(htmlElementId);
          element.scrollIntoView();
          return;
        }
        return;
      }, 1000);
    } else {
      return;
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
      object.replys_count = Number(object.replys_count) - 1;
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
    const url = `${ this.urlCredentialsNovelsDb }/create-like`;
    return this.http.post(url, like, this.GlobalhttpOptions);
  }

  deleteLike(id: number) {
    const url = `${this.urlCredentialsNovelsDb}/delete-like/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }

  getAdvertisements() {
    const url = `${ this.urlNovelsDb }/get-advertisements`;
    return this.http.get( url );
  }

  getAdvertisement(id: number) {
    const url = `${ this.urlNovelsDb }/get-advertisement/${id}`;
    return this.http.get( url );
  }

  createComment(comment: Comment) {
    const url = `${ this.urlCredentialsNovelsDb }/create-comment`;
    return this.http.post(url, comment, this.GlobalhttpOptions);
  }

  getComments(id: number, objectType: string) {
    const url = `${ this.urlNovelsDb }/get-comments/${id}/${objectType}`;
    return this.http.get( url );
  }

  updateComment(comment: Comment) {
    const url = `${ this.urlCredentialsNovelsDb }/update-comment`;
    return this.http.put(url , comment, this.GlobalhttpOptions);
  }

  deleteComment(id: number) {
    const url = `${ this.urlCredentialsNovelsDb }/delete-comment/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }

  createReply(reply: Reply) {
    const url = `${ this.urlCredentialsNovelsDb }/create-reply`;
    return this.http.post(url, reply, this.GlobalhttpOptions);
  }

  getReplys(id: number, objectType: string) {
    const url = `${ this.urlNovelsDb }/get-replys/${id}/${objectType}`;
    return this.http.get( url );
  }

  updateReply(reply: Reply) {
    const url = `${ this.urlCredentialsNovelsDb }/update-reply`;
    return this.http.put(url , reply, this.GlobalhttpOptions);
  }

  deleteReply(id: number) {
    const url = `${ this.urlCredentialsNovelsDb }/delete-reply/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }
}

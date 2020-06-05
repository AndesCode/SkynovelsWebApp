import { Component, OnInit, TemplateRef } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Advertisement, User, AdvertisementCommentReply, Like } from 'src/app/models/models';
import { NovelsService } from '../../services/novels.service';
import { HelperService } from '../../services/helper.service';
import { AdvertisementComment } from '../../models/models';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { LikesService } from '../../services/likes.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss']
})
export class AdvertisementComponent implements OnInit {

  advertisement: Advertisement;
  loading = true;
  user: User;
  newComment: FormGroup;

  constructor(private us: UsersService,
              private ns: NovelsService,
              public hs: HelperService,
              private ls: LikesService,
              public dialog: MatDialog,
              public matSnackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location) {

                this.newComment = new FormGroup({
                  adv_id: new FormControl(''),
                  adv_comment: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2000)]),
                });
              }

  ngOnInit(): void {
    this.hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'reloadUser') {
        this.getUser();
      }
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.ns.getAdvertisement(Number(id)).subscribe((data: any) => {
      this.advertisement = data.advertisement;
      this.location.replaceState('/noticias/' + this.advertisement.id + '/' + this.advertisement.adv_name);
      console.log(this.advertisement);
      for (const advertisementcomment of  this.advertisement.comments) {
        advertisementcomment.show_more = false;
        advertisementcomment.edition = false;
        advertisementcomment.show_replys = false;
        advertisementcomment.replys = [];
        advertisementcomment.advertisement_comment_reply = null;
      }
      this.getUser();
      this.loading = false;
    }, error => {
      this.router.navigate(['']);
    });
  }

  openDialogSheet(item): void {
    this.dialog.open(item);
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  getUser() {
    this.user = this.us.getUserLoged();
    console.log(this.user);
    this.advertisement.liked = false;
    this.advertisement.like_id = null;
    if (this.user) {
      for (const advertisementLike of  this.advertisement.likes) {
        if (advertisementLike.user_id === this.user.id) {
          this.advertisement.liked = true;
          this.advertisement.like_id = advertisementLike.id;
          break;
        }
      }
    }
    for (const advertisementComment of this.advertisement.comments) {
      advertisementComment.liked = false;
      advertisementComment.like_id = null;
      for (const advertisementCommentReply of advertisementComment.replys) {
        advertisementCommentReply.liked = false;
        advertisementCommentReply.like_id = null;
      }
      if (this.user) {
        for (const advertisementCommentLike of  advertisementComment.likes) {
          if (advertisementCommentLike.user_id === this.user.id) {
            advertisementComment.liked = true;
            advertisementComment.like_id = advertisementCommentLike.id;
            break;
          }
        }
        for (const advertisementCommentReply of advertisementComment.replys) {
          for (const advertisementCommentReplyLike of advertisementCommentReply.likes) {
            if (advertisementCommentReplyLike.user_id === this.user.id) {
              advertisementCommentReply.liked = true;
              advertisementCommentReply.like_id = advertisementCommentReplyLike.id;
              break;
            }
          }
        }
      }
    }
  }

  switchLike(likeableObject: any, ObjectIdType: string) {
    if (this.user) {
      if (likeableObject.liked === false) {
        likeableObject.liked = true;
        const like: Like = {
          [ObjectIdType]: likeableObject.id
        };
        this.ls.createLike(like).subscribe((data: any) => {
          likeableObject.like_id = data.like.id;
          likeableObject.likes.push(data.like);
        }, error => {
          likeableObject.liked = false;
        });
      } else {
        likeableObject.liked = false;
        this.ls.deleteLike(likeableObject.like_id).subscribe((data: any) => {
          likeableObject.likes.splice(likeableObject.likes.findIndex(x => x.id === likeableObject.like_id), 1);
          likeableObject.like_id = null;
        }, error => {
          likeableObject.liked = true;
        });
      }
      console.log(likeableObject);
    } else {
      return;
    }
  }

  editComment(comments: any) {
    comments.edition = true;
  }

  showMoreComment(comment) {
    if (comment.show_more === true) {
      comment.show_more = false;
    } else {
      comment.show_more = true;
    }
  }

  createAdvertisementComment() {
    console.log(this.newComment);
    this.newComment.patchValue({
      adv_id: this.advertisement.id
    });
    this.ns.createAdvertisementComment(this.newComment.value).subscribe((data: any) => {
      data.advertisement_comment.user_login = this.user.user_login;
      data.advertisement_comment.liked = false;
      data.advertisement_comment.show_more = false;
      data.advertisement_comment.edition = false;
      data.advertisement_comment.likes = [];
      data.advertisement_comment.replys = [];
      data.advertisement_comment.advertisement_comment_reply = null;
      data.advertisement_comment.show_replys = false;
      console.log(data.advertisement_comment);
      this.advertisement.comments.push(data.advertisement_comment);
    });
    console.log(this.advertisement);
  }

  updateAdvertisementComment(updateCommentForm: NgForm, comment: any) {
    console.log(updateCommentForm);
    if (updateCommentForm.dirty) {
      if (updateCommentForm.valid) {
        this.ns.updateAdvertisementComment(comment).subscribe((data: any) => {
          console.log(data);
          comment.edition = false;
        });
      } else {
        comment.edition = false;
      }
    } else {
      comment.edition = false;
    }
  }

  deleteAdvertisementComment(comment: any) {
    this.ns.deleteAdvertisementComment(comment.id).subscribe((data: any) => {
      this.advertisement.comments.splice(this.advertisement.comments.findIndex(x => x.id === comment.id), 1);
    });
  }

  getAdvertismentCommentReplys(comment: any) {
    if (comment.replys.length > 0) {
      comment.show_replys = true;
    } else {
      this.ns.getAdvertisementCommentReplys(comment.id).subscribe((data: any) => {
        comment.replys = data.advertisement_comment_replys;
        console.log(comment.replys);
        for (const CommentReply of comment.replys) {
          CommentReply.liked = false;
          CommentReply.show_more = false;
          CommentReply.edition = false;
          CommentReply.date_data = this.hs.getRelativeTime(CommentReply.createdAt);
          if (this.user) {
            for (const CommentReplyLike of CommentReply.likes) {
              if (CommentReplyLike.user_id === this.user.id) {
                CommentReply.liked = true;
                CommentReply.like_id = CommentReplyLike.id;
                break;
              }
            }
          }
        }
        console.log(comment);
        comment.show_replys = true;
        comment.replys.sort(this.hs.dateDataSorter);
      });
    }
  }

  createAvertismeentCommentReply(advertisementComment: AdvertisementComment) {
    const newAdvertismeentCommentReply: AdvertisementCommentReply = {
      adv_comment_id: advertisementComment.id,
      adv_comment_reply: advertisementComment.advertisement_comment_reply
    };
    this.ns.createAdvertisementCommentReply(newAdvertismeentCommentReply).subscribe((data: any) => {
      data.advertisement_comment_reply.user_login = this.user.user_login;
      data.advertisement_comment_reply.user_profile_image = this.user.user_profile_image;
      data.advertisement_comment_reply.liked = false;
      data.advertisement_comment_reply.show_more = false;
      data.advertisement_comment_reply.edition = false;
      data.advertisement_comment_reply.likes = [];
      data.advertisement_comment_reply.date_data = this.hs.getRelativeTime(data.advertisement_comment_reply.createdAt);
      console.log(data.advertisement_comment_reply);
      advertisementComment.replys.unshift(data.advertisement_comment_reply);
      advertisementComment.advertisement_comment_reply = null;
    });
  }

  updateAdvertisementCommentReply(updateAvertismeentCommentReplyForm: NgForm, advertisementCommentReply: AdvertisementCommentReply) {
    console.log(updateAvertismeentCommentReplyForm);
    if (updateAvertismeentCommentReplyForm.dirty) {
      if (updateAvertismeentCommentReplyForm.valid) {
        this.ns.updateChapterCommentReply(advertisementCommentReply).subscribe((data: any) => {
          console.log(data);
          advertisementCommentReply.edition = false;
        });
      } else {
        advertisementCommentReply.edition = false;
      }
    } else {
      advertisementCommentReply.edition = false;
    }
  }

  deleteAvertismeentCommentReply(comment: any, commentReply: any) {
    this.ns.deleteAdvertisementCommentReply(commentReply.id).subscribe((data: any) => {
      comment.replys.splice(comment.replys.findIndex(x => x.id === commentReply.id), 1);
      console.log(data);
    });
  }

  hideAdvertismentCommentReplys(comment: any) {
    comment.show_replys = false;
  }

}

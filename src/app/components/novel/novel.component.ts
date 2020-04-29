import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { NovelsService } from '../../services/novels.service';
import { HelperService } from '../../services/helper.service';
import { LikesService } from '../../services/likes.service';
import { UsersService } from '../../services/users.service';
import {BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-novel',
  templateUrl: './novel.component.html',
  styleUrls: ['./novel.component.scss']
})
export class NovelComponent implements OnInit {

  public Editor = ClassicEditor;
  // delete
  novel: any = {};
  currentTab = 'info';
  // novel: NovelModel = new NovelModel();
  user: any = null;
  new_rating_form: FormGroup;
  emailFormControl: FormGroup;
  public new_rating = {
    novel_id: null,
    rate_value: 0,
    rate_comment: null
  };
  mobile: boolean;
  loading = true;
  panelOpenState = false;



    constructor(private _ns: NovelsService,
                private activatedRoute: ActivatedRoute,
                private breakpointObserver: BreakpointObserver,
                private _ls: LikesService,
                private _us: UsersService,
                private modalService: NgbModal,
                private renderer: Renderer2,
                private router: Router,
                public _hs: HelperService,
                public _bottomSheet: MatBottomSheet,
                public _dialog: MatDialog) {}




  ngOnInit(): void {

    this.breakpointObserver
    .observe('(max-width: 679px)')
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.mobile = true;
        console.log(this.mobile);
      } else {
        this.mobile = false;
      }
    });


    this._hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'reloadUser') {
        this.getUser();
      }
    });
    const url_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this._ns.getNovel(url_id, 'reading').subscribe((data: any) => {
      this.novel = data.novel[0];
      this.novel.user_bookmark = null;
      this.calculateNovelRatingAvarage();
      this.novel.date_data = this._hs.getRelativeTime(this.novel.nvl_last_update);
      if (this.novel.nvl_status === 'Finished') {
        this.novel.nvl_status = 'Finalizada';
      } else {
        if (this.novel.date_data.seconds > 1296000) {
          this.novel.nvl_status = 'Inactiva';
        } else {
          this.novel.nvl_status = 'Activa';
        }
      }
      for (let i = 0; i < this.novel.novel_ratings.length; i++) {
        this.novel.novel_ratings[i].show_more = false;
        this.novel.novel_ratings[i].edition = false;
        this.novel.novel_ratings[i].show_replys = false;
        this.novel.novel_ratings[i].rating_comments = [];
        this.novel.novel_ratings[i].novel_rating_comment = null;
      }
      for (let i = 0; i < this.novel.volumes.length; i++) {
        for (let j = 0; j < this.novel.volumes[i].chapters.length; j++) {
          this.novel.volumes[i].chapters[j].date_data = this._hs.getRelativeTime(this.novel.volumes[i].chapters[j].createdAt);
        }
      }
      const last_volume = this.novel.volumes[this.novel.volumes.length - 1];
      this.novel.nvl_last_chapter = last_volume.chapters[last_volume.chapters.length - 1];
      this.getUser();
      console.log(data.novel);
      this.loading = false;
    });
  }

  calculateNovelRatingAvarage() {
    this.novel.nvl_rating = this._hs.novelRatingAvarageCalculator(this.novel.novel_ratings);
  }

  openBottomSheet(item): void {
    this._bottomSheet.open(item);
  }

  openDialogSheet(item): void {
    this._dialog.open(item);
  }

  openSm(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  switchRatingLike(novel_rating) {
    if (this.user) {
      if (novel_rating.liked === false) {
        novel_rating.liked = true;
        this._ls.createNovelRatingLike(novel_rating.id).subscribe((data: any) => {
          novel_rating.like_id = data.novel_rating_like.id;
          novel_rating.likes.push(data.novel_rating_like);
          console.log(data.novel_rating_like);
        }, error => {
          novel_rating.liked = false;
        });
      } else {
        novel_rating.liked = false;
        this._ls.deleteNovelRatingLike(novel_rating.like_id).subscribe((data: any) => {
          novel_rating.likes.splice(novel_rating.likes.findIndex(x => x.id === novel_rating.like_id), 1);
          novel_rating.like_id = null;
        }, error => {
          novel_rating.liked = true;
        });
      }
      console.log(this.novel.novel_ratings);
    } else {
      return;
    }
  }

  switchRatingCommentLike(novel_rating_comment) {
    if (this.user) {
      if (novel_rating_comment.liked === false) {
        novel_rating_comment.liked = true;
        this._ls.createNovelRatingCommentLike(novel_rating_comment.id).subscribe((data: any) => {
          novel_rating_comment.like_id = data.novel_rating_comment_like.id;
          novel_rating_comment.likes.push(data.novel_rating_comment_like);
          console.log(data.novel_rating_comment_like);
        }, error => {
          novel_rating_comment.liked = false;
        });
      } else {
        novel_rating_comment.liked = false;
        this._ls.deleteNovelRatingCommentLike(novel_rating_comment.like_id).subscribe((data: any) => {
          novel_rating_comment.likes.splice(novel_rating_comment.likes.findIndex(x => x.id === novel_rating_comment.like_id), 1);
          novel_rating_comment.like_id = null;
        }, error => {
          novel_rating_comment.liked = true;
        });
      }
      console.log(this.novel.novel_ratings);
    } else {
      return;
    }
  }

  switchBookMark() {
    if (this.novel.user_bookmark === null) {
      this._us.createUserBookmark(this.novel.id).subscribe((data: any) => {
        this.novel.user_bookmark = data.bookmark;
        this.novel.bookmarks.push(data.bookmark);
      });
    } else {
      this._us.deleteUserBoomark(this.novel.user_bookmark.id).subscribe((data: any) => {
        this.novel.bookmarks.splice(this.novel.bookmarks.findIndex(x => x.id === this.novel.user_bookmark.id), 1);
        this.novel.user_bookmark = null;
      });
    }
  }

  getUser() {
    this.user = this._us.getUserLoged();
    console.log(this.user);
    this.novel.nvl_rated = false;
    for (let i = 0; i < this.novel.novel_ratings.length; i++) {
      this.novel.novel_ratings[i].liked = false;
      this.novel.novel_ratings[i].like_id = null;
      if (this.user && this.novel.novel_ratings[i].user_id === this.user.id) {
          this.novel.nvl_rated = true;
      }
      for (let j = 0; j < this.novel.novel_ratings[i].rating_comments.length; j++) {
        this.novel.novel_ratings[i].rating_comments[j].liked = false;
        this.novel.novel_ratings[i].rating_comments[j].like_id = null;
      }
      if (this.user) {
        for (let j = 0; j < this.novel.novel_ratings[i].likes.length; j++) {
          if (this.novel.novel_ratings[i].likes[j].user_id === this.user.id) {
            this.novel.novel_ratings[i].liked = true;
            this.novel.novel_ratings[i].like_id = this.novel.novel_ratings[i].likes[j].id;
            break;
          }
        }
        for (let j = 0; j < this.novel.novel_ratings[i].rating_comments.length; j++) {
          for (let k = 0; k < this.novel.novel_ratings[i].rating_comments[j].likes.length; k++) {
            if (this.novel.novel_ratings[i].rating_comments[j].likes[k].user_id === this.user.id) {
              this.novel.novel_ratings[i].rating_comments[j].liked = true;
              this.novel.novel_ratings[i].rating_comments[j].like_id = this.novel.novel_ratings[i].rating_comments[j].likes[k].id;
              break;
            }
          }
        }
      }
    }
    if (this.user) {
      for (let i = 0; i < this.novel.bookmarks.length; i++) {
        if (this.novel.bookmarks[i].user_id === this.user.id) {
          this.novel.user_bookmark = this.novel.bookmarks[i];
          break;
        }
      }
    }
  }

  swichtTab(tab: string) {
    this.currentTab = tab;
  }

  showMoreRating(rating) {
    if (rating.show_more === true) {
      rating.show_more = false;
    } else {
      rating.show_more = true;
    }
  }

  editRating(rating: any) {
    rating.edition = true;
  }

  updateRating(updateRatingForm: NgForm, rating: any) {
    console.log(updateRatingForm);
    if (updateRatingForm.dirty) {
      if (updateRatingForm.valid) {
        this._ns.updateNovelRating(rating).subscribe((data: any) => {
          console.log(data);
          rating.edition = false;
        });
      } else {
        rating.edition = false;
      }
    } else {
      rating.edition = false;
    }
  }

  deleteRating(rating: any) {
    this._ns.deleteNovelRating(rating.id).subscribe((data: any) => {
      this.novel.novel_ratings.splice(this.novel.novel_ratings.findIndex(x => x.id === rating.id), 1);
      this.novel.nvl_rated = false;
      console.log(data);
      this.calculateNovelRatingAvarage();
    });
  }

  createNovelRating() {
  console.log(this.new_rating_form);
  console.log(this.new_rating);
  this.new_rating.novel_id = this.novel.id;
  this._ns.createNovelRating(this.new_rating).subscribe((data: any) => {
    data.novel_rating.user_login = this.user.user_login;
    data.novel_rating.liked = false;
    data.novel_rating.show_replys = false;
    data.novel_rating.show_more = false;
    data.novel_rating.edition = false;
    data.novel_rating.likes = [];
    data.novel_rating.rating_comments = [];
    this.novel.nvl_rated = true;
    console.log(data.novel_rating);
    this.novel.novel_ratings.push(data.novel_rating);
    this.calculateNovelRatingAvarage();
  });
  console.log(this.novel);
  }

  hideNovelRatingComments(rating: any) {
    rating.show_replys = false;
  }

  getNovelRatingComments(rating: any) {
    if (rating.rating_comments.length > 0) {
      rating.show_replys = true;
    } else {
      this._ns.getNovelRatingComments(rating.id).subscribe((data: any) => {
        rating.rating_comments = data.novel_rating_comments;
        console.log(rating.rating_comments);
        for (let i = 0; i < rating.rating_comments.length; i++) {
          rating.rating_comments[i].liked = false;
          rating.rating_comments[i].show_more = false;
          rating.rating_comments[i].edition = false;
          rating.rating_comments[i].date_data = this._hs.getRelativeTime(rating.rating_comments[i].createdAt);
          if (this.user) {
            for (let j = 0; j < rating.rating_comments[i].likes.length; j++) {
              if (rating.rating_comments[i].likes[j].user_id === this.user.id) {
                rating.rating_comments[i].liked = true;
                rating.rating_comments[i].like_id = rating.rating_comments[i].likes[j].id;
                break;
              }
            }
          }
        }
        console.log(rating);
        rating.show_replys = true;
        rating.rating_comments.sort(this._hs.dateDataSorter);
      });
    }
  }

  createNovelRatingComment(rating: any) {
    const new_rating_comment = {
      novel_rating_id: rating.id,
      novel_rating_comment: rating.novel_rating_comment
    };
    this._ns.createNovelRatingComment(new_rating_comment).subscribe((data: any) => {
      data.novel_rating_comment.user_login = this.user.user_login;
      data.novel_rating_comment.liked = false;
      data.novel_rating_comment.show_more = false;
      data.novel_rating_comment.edition = false;
      data.novel_rating_comment.likes = [];
      data.novel_rating_comment.date_data = this._hs.getRelativeTime(data.novel_rating_comment.createdAt);
      console.log(data.novel_rating);
      rating.rating_comments.unshift(data.novel_rating_comment);
      rating.novel_rating_comment = null;
    });
  }

  updateNovelRatingComment(updateRatingCommentForm: NgForm, ratingComment: any) {
    console.log(updateRatingCommentForm);
    if (updateRatingCommentForm.dirty) {
      if (updateRatingCommentForm.valid) {
        this._ns.updateNovelRatingComment(ratingComment).subscribe((data: any) => {
          console.log(data);
          ratingComment.edition = false;
        });
      } else {
        ratingComment.edition = false;
      }
    } else {
      ratingComment.edition = false;
    }
  }

  deleteRatingComment(rating: any, ratingComment: any) {
    this._ns.deleteNovelRatingComment(ratingComment.id).subscribe((data: any) => {
      rating.rating_comments.splice(rating.rating_comments.findIndex(x => x.id === ratingComment.id), 1);
      console.log(data);
    });
  }

  goToChapter(chapter: any) {
    this.router.navigate(['novelas', this.novel.id, this.novel.nvl_name, chapter.id, chapter.chp_name]);
  }
}

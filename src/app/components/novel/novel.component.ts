import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { NovelsService } from '../../services/novels.service';
import { HelperService } from '../../services/helper.service';
import { LikesService } from '../../services/likes.service';
import { UsersService } from '../../services/users.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Novel, User, Like } from 'src/app/models/models';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-novel',
  templateUrl: './novel.component.html',
  styleUrls: ['./novel.component.scss']
})
export class NovelComponent implements OnInit {

  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  public Editor = ClassicEditor;
  novel: Novel;
  user: User;
  currentTab = 'info';
  newRatingForm: FormGroup;
  mobile: boolean;
  loading = true;
  panelOpenState = false;

    constructor(private ns: NovelsService,
                private activatedRoute: ActivatedRoute,
                private breakpointObserver: BreakpointObserver,
                private ls: LikesService,
                private us: UsersService,
                private router: Router,
                private location: Location,
                public matSnackBar: MatSnackBar,
                public hs: HelperService,
                public bottomSheet: MatBottomSheet,
                public dialog: MatDialog,
                private meta: Meta,
                private title: Title) {

                  this.newRatingForm = new FormGroup({
                    novel_id: new FormControl(''),
                    rate_value: new FormControl('0', [Validators.required, Validators.min(1), Validators.max(5)]),
                    rate_comment: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2000)]),
                  });

                }

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

    this.hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'reloadUser') {
        this.getUser();
      }
    });
    const urlId = Number(this.activatedRoute.snapshot.paramMap.get('nid'));
    this.ns.getNovel(urlId, 'reading').subscribe((data: any) => {
      this.novel = data.novel[0];
      this.novel.user_bookmark = null;
      this.title.setTitle(this.novel.nvl_title);
      this.meta.updateTag({name: this.novel.nvl_content});
      this.calculateNovelRatingAvarage();
      this.novel.date_data = this.hs.getRelativeTime(this.novel.nvl_last_update);
      if (this.novel.nvl_status === 'Finished') {
        this.novel.nvl_status = 'Finalizada';
      } else {
        if (this.novel.date_data.seconds > 1296000) {
          this.novel.nvl_status = 'Inactiva';
        } else {
          this.novel.nvl_status = 'Activa';
        }
      }
      for (const novelRating of  this.novel.novel_ratings) {
        novelRating.show_more = false;
        novelRating.edition = false;
        novelRating.show_replys = false;
        novelRating.rating_comments = [];
        novelRating.novel_rating_comment = null;
      }
      for (const volume of this.novel.volumes) {
        for (const chapter of volume.chapters) {
          chapter.date_data = this.hs.getRelativeTime(chapter.createdAt);
        }
      }
      const lastVolume = this.novel.volumes[this.novel.volumes.length - 1];
      this.novel.nvl_last_chapter = lastVolume.chapters[lastVolume.chapters.length - 1];
      this.getUser();
      console.log(data.novel);
      this.location.replaceState('/novelas/' + this.novel.id + '/' + this.novel.nvl_name);
      this.loading = false;
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
      this.router.navigate(['novelas']);
    });
  }

  calculateNovelRatingAvarage() {
    this.novel.nvl_rating = this.hs.novelRatingAvarageCalculator(this.novel.novel_ratings);
  }

  openBottomSheet(item): void {
    this.bottomSheet.open(item);
  }

  openDialogSheet(item): void {
    this.dialog.open(item);
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  switchRatingLike(novelRating) {
    if (this.user) {
      if (novelRating.liked === false) {
        novelRating.liked = true;
        const like: Like = {
          novel_rating_id: novelRating.id
        };
        this.ls.createLike(like).subscribe((data: any) => {
          novelRating.like_id = data.like.id;
          novelRating.likes.push(data.like);
        }, error => {
          novelRating.liked = false;
          this.openMatSnackBar(this.errorSnackRef);
          this.errorSnackMessage = error.error.message;
        });
      } else {
        novelRating.liked = false;
        this.ls.deleteLike(novelRating.like_id).subscribe((data: any) => {
          novelRating.likes.splice(novelRating.likes.findIndex(x => x.id === novelRating.like_id), 1);
          novelRating.like_id = null;
        }, error => {
          novelRating.liked = true;
          this.openMatSnackBar(this.errorSnackRef);
          this.errorSnackMessage = error.error.message;
        });
      }
      console.log(this.novel.novel_ratings);
    } else {
      return;
    }
  }

  switchRatingCommentLike(novelRatingComment) {
    if (this.user) {
      if (novelRatingComment.liked === false) {
        novelRatingComment.liked = true;
        const like: Like = {
          novel_rating_comment_id: novelRatingComment.id
        };
        this.ls.createLike(like).subscribe((data: any) => {
          novelRatingComment.like_id = data.like.id;
          novelRatingComment.likes.push(data.like);
        }, error => {
          novelRatingComment.liked = false;
          this.openMatSnackBar(this.errorSnackRef);
          this.errorSnackMessage = error.error.message;
        });
      } else {
        novelRatingComment.liked = false;
        this.ls.deleteLike(novelRatingComment.like_id).subscribe((data: any) => {
          novelRatingComment.likes.splice(novelRatingComment.likes.findIndex(x => x.id === novelRatingComment.like_id), 1);
          novelRatingComment.like_id = null;
        }, error => {
          novelRatingComment.liked = true;
          this.openMatSnackBar(this.errorSnackRef);
          this.errorSnackMessage = error.error.message;
        });
      }
      console.log(this.novel.novel_ratings);
    } else {
      return;
    }
  }

  switchBookMark() {
    if (this.novel.user_bookmark === null) {
      this.us.createUserBookmark(this.novel.id).subscribe((data: any) => {
        this.novel.user_bookmark = data.bookmark;
        this.novel.bookmarks.push(data.bookmark);
      }, error => {
        this.openMatSnackBar(this.errorSnackRef);
        this.errorSnackMessage = error.error.message;
        return;
      });
    } else {
      this.us.deleteUserBoomark(this.novel.user_bookmark.id).subscribe((data: any) => {
        this.novel.bookmarks.splice(this.novel.bookmarks.findIndex(x => x.id === this.novel.user_bookmark.id), 1);
        this.novel.user_bookmark = null;
      }, error => {
        this.openMatSnackBar(this.errorSnackRef);
        this.errorSnackMessage = error.error.message;
        return;
      });
    }
  }

  getUser() {
    this.user = this.us.getUserLoged();
    console.log(this.user);
    this.novel.nvl_rated = false;
    for (const novelRating of this.novel.novel_ratings) {
      novelRating.liked = false;
      novelRating.like_id = null;
      if (this.user && novelRating.user_id === this.user.id) {
          this.novel.nvl_rated = true;
      }
      for (const novelRatingComment of novelRating.rating_comments) {
        novelRatingComment.liked = false;
        novelRatingComment.like_id = null;
      }
      if (this.user) {
        for (const novelRatingLike of  novelRating.likes) {
          if (novelRatingLike.user_id === this.user.id) {
            novelRating.liked = true;
            novelRating.like_id = novelRatingLike.id;
            break;
          }
        }
        for (const novelRatingComment of novelRating.rating_comments) {
          for (const novelRatingCommentLike of novelRatingComment.likes) {
            if (novelRatingCommentLike.user_id === this.user.id) {
              novelRatingComment.liked = true;
              novelRatingComment.like_id = novelRatingCommentLike.id;
              break;
            }
          }
        }
      }
    }
    if (this.user) {
      for (const novelBookmark of this.novel.bookmarks) {
        if (novelBookmark.user_id === this.user.id) {
          this.novel.user_bookmark = novelBookmark;
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
        this.ns.updateNovelRating(rating).subscribe((data: any) => {
          console.log(data);
          rating.edition = false;
        }, error => {
          this.openMatSnackBar(this.errorSnackRef);
          this.errorSnackMessage = error.error.message;
          return;
        });
      } else {
        rating.edition = false;
      }
    } else {
      rating.edition = false;
    }
  }

  deleteRating(rating: any) {
    this.ns.deleteNovelRating(rating.id).subscribe((data: any) => {
      this.novel.novel_ratings.splice(this.novel.novel_ratings.findIndex(x => x.id === rating.id), 1);
      this.novel.nvl_rated = false;
      console.log(data);
      this.calculateNovelRatingAvarage();
    });
  }

  createNovelRating() {
    this.newRatingForm.patchValue({
      novel_id: this.novel.id
    });
    this.ns.createNovelRating(this.newRatingForm.value).subscribe((data: any) => {
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
      this.newRatingForm.reset();
      this.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Calificación publicada!';
      return;
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
      return;
    });
  }

  hideNovelRatingComments(rating: any) {
    rating.show_replys = false;
  }

  getNovelRatingComments(rating: any) {
    if (rating.rating_comments.length > 0) {
      rating.show_replys = true;
    } else {
      this.ns.getNovelRatingComments(rating.id).subscribe((data: any) => {
        rating.rating_comments = data.novel_rating_comments;
        console.log(rating.rating_comments);
        for (const ratingComment of rating.rating_comments) {
          ratingComment.liked = false;
          ratingComment.show_more = false;
          ratingComment.edition = false;
          ratingComment.date_data = this.hs.getRelativeTime(ratingComment.createdAt);
          if (this.user) {
            for (const ratingCommentLike of ratingComment.likes) {
              if (ratingCommentLike.user_id === this.user.id) {
                ratingComment.liked = true;
                ratingComment.like_id = ratingCommentLike.id;
                break;
              }
            }
          }
        }
        console.log(rating);
        rating.show_replys = true;
        rating.rating_comments.sort(this.hs.dateDataSorter);
      });
    }
  }

  createNovelRatingComment(rating: any) {
    const newRatingComment = {
      novel_rating_id: rating.id,
      novel_rating_comment: rating.novel_rating_comment
    };
    this.ns.createNovelRatingComment(newRatingComment).subscribe((data: any) => {
      data.novel_rating_comment.user_login = this.user.user_login;
      data.novel_rating_comment.user_profile_image = this.user.user_profile_image;
      data.novel_rating_comment.liked = false;
      data.novel_rating_comment.show_more = false;
      data.novel_rating_comment.edition = false;
      data.novel_rating_comment.likes = [];
      data.novel_rating_comment.date_data = this.hs.getRelativeTime(data.novel_rating_comment.createdAt);
      console.log(data.novel_rating);
      rating.rating_comments.unshift(data.novel_rating_comment);
      rating.novel_rating_comment = null;
    });
  }

  updateNovelRatingComment(updateRatingCommentForm: NgForm, ratingComment: any) {
    console.log(updateRatingCommentForm);
    if (updateRatingCommentForm.dirty) {
      if (updateRatingCommentForm.valid) {
        this.ns.updateNovelRatingComment(ratingComment).subscribe((data: any) => {
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
    this.ns.deleteNovelRatingComment(ratingComment.id).subscribe((data: any) => {
      rating.rating_comments.splice(rating.rating_comments.findIndex(x => x.id === ratingComment.id), 1);
      console.log(data);
    });
  }

  goToChapter(chapter: any) {
    this.router.navigate(['novelas', this.novel.id, this.novel.nvl_name, chapter.id, chapter.chp_name]);
  }
}

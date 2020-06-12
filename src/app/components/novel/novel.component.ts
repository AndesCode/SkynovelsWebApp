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
import { Novel, User } from 'src/app/models/models';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Meta, Title } from '@angular/platform-browser';
import { PageService } from '../../services/page.service';

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
                public ls: LikesService,
                public ps: PageService,
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
        novelRating.replys = [];
        novelRating.reply = null;
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
      for (const novelRatingReply of novelRating.replys) {
        novelRatingReply.liked = false;
        novelRatingReply.like_id = null;
      }
      if (this.user) {
        for (const novelRatingLike of  novelRating.likes) {
          if (novelRatingLike.user_id === this.user.id) {
            novelRating.liked = true;
            novelRating.like_id = novelRatingLike.id;
            break;
          }
        }
        for (const novelRatingReply of novelRating.replys) {
          for (const novelRatingCommentLike of novelRatingReply.likes) {
            if (novelRatingCommentLike.user_id === this.user.id) {
              novelRatingReply.liked = true;
              novelRatingReply.like_id = novelRatingCommentLike.id;
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

  goToChapter(chapter: any) {
    this.router.navigate(['novelas', this.novel.id, this.novel.nvl_name, chapter.id, chapter.chp_name]);
  }
}

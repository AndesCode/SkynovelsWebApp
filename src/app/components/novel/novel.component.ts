import { Component, OnInit, ViewChild, TemplateRef, isDevMode } from '@angular/core';
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
import { PageService } from '../../services/page.service';
import { Dev, Prod } from 'src/app/config/config';

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
  novel: Novel;
  user: User;
  currentTab = 'info';
  newRatingForm: FormGroup;
  mobile: boolean;
  loading = true;
  novelChaptersForWeeks = 0;
  componentName = 'NovelComponent';
  apiURL: string;
  public imgURL: any  = '../../../assets/img/noimage.jpg';

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
                private dev: Dev,
                private prod: Prod) {
                  if (isDevMode()) {
                    this.apiURL = this.dev.apiURL
                  } else {
                    this.apiURL = this.prod.apiURL
                  }
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
      this.hs.updateBrowserMeta('description', this.novel.nvl_content, this.novel.nvl_title);
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
      if (this.novel.image && this.novel.image.length > 0) {
        this.imgURL = this.apiURL + '/api/get-image/' + this.novel.image + '/novels/false';
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
          if (chapter.date_data.seconds < 604801) {
            this.novelChaptersForWeeks = this.novelChaptersForWeeks + 1;
          }
        }
      }
      const lastVolume = this.novel.volumes[this.novel.volumes.length - 1];
      this.novel.nvl_last_chapter = lastVolume.chapters[lastVolume.chapters.length - 1];
      this.getUser();
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
      this.us.createUserBookmark(this.novel.id, this.novel.volumes[0].chapters[0].id).subscribe((data: any) => {
        this.novel.user_bookmark = data.bookmark;
        this.novel.bookmarks.push(data.bookmark);
        this.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Novela agregada a tu lista de lectura!';
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
    } else {
      this.novel.user_bookmark = null;
    }
  }

  swichtTab(tab: string) {
    this.currentTab = tab;
  }

  updateRating(updateRatingForm: NgForm, rating: any) {
    if (updateRatingForm.dirty) {
      if (updateRatingForm.valid) {
        this.ns.updateNovelRating(rating).subscribe((data: any) => {
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

  openLoginForm() {
    this.hs.openExternalFunction('loginForm');
  }

  deleteRating(rating: any) {
    this.ns.deleteNovelRating(rating.id).subscribe((data: any) => {
      this.novel.novel_ratings.splice(this.novel.novel_ratings.findIndex(x => x.id === rating.id), 1);
      this.novel.nvl_rated = false;
      this.calculateNovelRatingAvarage();
    });
  }

  createNovelRating() {
    this.newRatingForm.patchValue({
      novel_id: this.novel.id
    });
    this.ns.createNovelRating(this.newRatingForm.value).subscribe((data: any) => {
      data.novel_rating.user_login = this.user.user_login;
      data.novel_rating.image = this.user.image;
      data.novel_rating.liked = false;
      data.novel_rating.show_replys = false;
      data.novel_rating.show_more = false;
      data.novel_rating.edition = false;
      data.novel_rating.likes = [];
      data.novel_rating.reply = null;
      data.novel_rating.replys = [];
      this.novel.nvl_rated = true;
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

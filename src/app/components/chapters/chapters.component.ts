import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild, ViewChildren, TemplateRef  } from '@angular/core';
import { Location } from '@angular/common';
import { NovelsService } from '../../services/novels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { HelperService } from '../../services/helper.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Novel, User } from 'src/app/models/models';
import { PageService } from '../../services/page.service';
import { Chapter } from '../../models/models';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss']
})
export class ChaptersComponent implements AfterViewInit {

  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  @ViewChild('mainpanel') mainpanelRef: ElementRef;
  selector = '.skn-chp-main-panel';
  novel: Novel;
  LoadedChapters: Array<Chapter> = [];
  allChapters: Array<Chapter> = [];
  scrolling: any;
  currentPageDown = null;
  currentPageUp = null;
  currentChapter = null;
  loading = false;
  loadPortrait = false;
  user: User = null;
  newRatingForm: FormGroup;
  newCommentForm: FormGroup;
  newComment: FormGroup;
  mobile: boolean;
  newCommentReply: FormGroup;
  chapterId: number;
  fontSize = 16;
  componentName = 'ChaptersComponent';

  @ViewChildren('chaptersElement') chaptersElementRef;


  constructor(private ns: NovelsService,
              private us: UsersService,
              public hs: HelperService,
              public ps: PageService,
              private renderer: Renderer2,
              private breakpointObserver: BreakpointObserver,
              private location: Location,
              public matSnackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              public bottomSheet: MatBottomSheet) {

                this.newRatingForm = new FormGroup({
                  novel_id: new FormControl(''),
                  rate_value: new FormControl('0', [Validators.required, Validators.min(1), Validators.max(5)]),
                  rate_comment: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2000)]),
                });
                this.newCommentReply = new FormGroup({
                  chapter_comment_id: new FormControl(''),
                  chapter_comment_reply: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2000)]),
                });
              }

  ngAfterViewInit(): void {
    this.breakpointObserver
    .observe('(max-width: 1152px)')
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
    const nvlId = Number(this.activatedRoute.snapshot.paramMap.get('nid'));
    this.ns.getNovelChapters(nvlId).subscribe((data: any) => {
      console.log(data);
      this.novel = data.novel[0];
      this.novel.user_bookmark = null;
      this.allChapters = this.novel.chapters;
      console.log(this.allChapters);
      this.getUser();
      this.loadNovelDataChapters();
    }, error => {
      this.router.navigate(['novelas']);
    });
    console.log(this.mainpanelRef);
    this.renderer.listen(this.mainpanelRef.nativeElement, 'scroll', () => {
      clearTimeout(this.scrolling);
      this.scrolling = setTimeout(() => {
        this.chaptersElementRef.forEach(chapterElementRef => {
          if (chapterElementRef.nativeElement.getBoundingClientRect().top < 350 &&
          chapterElementRef.nativeElement.getBoundingClientRect().bottom > 450 &&
          this.chapterId !== Number(chapterElementRef.nativeElement.firstElementChild.lastElementChild.firstElementChild.innerText)) {
            this.novel.nvl_currentChapter = chapterElementRef.nativeElement.firstElementChild.firstElementChild.lastElementChild.innerText;
            this.novel.nvl_currentChapterN = chapterElementRef.nativeElement.firstElementChild.lastElementChild.lastElementChild.innerText;
            this.chapterId = Number(chapterElementRef.nativeElement.firstElementChild.lastElementChild.firstElementChild.innerText);
            // Location
            this.location.replaceState('/novelas/' + this.novel.id + '/' + this.novel.nvl_name + '/' +
            this.chapterId + '/' +
            chapterElementRef.nativeElement.firstElementChild.firstElementChild.firstElementChild.innerText);
            if (this.novel.user_bookmark) {
              this.updateUserBookmark();
            }
          }
        });
      }, 100);
    });
  }

  changeFontSize(value: 'plus' | 'substract') {
    if (value === 'plus' && this.fontSize < 24) {
      this.fontSize = this.fontSize + 1;
    }
    if (value === 'substract' && this.fontSize > 1) {
      this.fontSize = this.fontSize - 1;
    }
  }

  updateUserBookmark() {
    this.novel.user_bookmark.chp_id = this.chapterId;
    this.us.updateUserBookmark(this.novel.user_bookmark).subscribe((data: any) => {
      console.log('bookmark actualizado');
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  loadNovelDataChapters(id?: any) {
    this.LoadedChapters = [];
    this.mainpanelRef.nativeElement.scrollTop = 0;
    let chpId: any;
    if (id) {
      chpId = Number(id);
    } else {
      chpId = Number(this.activatedRoute.snapshot.paramMap.get('cid'));
    }
    this.loadPortrait = false;
    console.log(chpId);
    this.currentChapter = this.allChapters.findIndex(x => x.id === Number(chpId));
    if (this.currentChapter === -1) {
      this.router.navigate(['novelas', this.novel.id, this.novel.nvl_name]);
    } else {
      this.ns.getNovelChapter(chpId).subscribe((data: any) => {
        this.chapterId = Number(data.chapter[0].id);
        this.location.replaceState('/novelas/' + this.novel.id + '/' + this.novel.nvl_name + '/' +
          this.chapterId + '/' + data.chapter[0].chp_name);
        this.allChapters[this.currentChapter] = data.chapter[0];
        if (this.currentChapter === 0) {
          this.loadPortrait = true;
        }
        this.initializeComment(data.chapter[0].comments);
        console.log(this.allChapters[this.currentChapter]);
        this.novel.nvl_currentChapter = data.chapter[0].chp_index_title;
        this.novel.nvl_currentChapterN = data.chapter[0].chp_number;
        this.LoadedChapters.push(this.allChapters[this.currentChapter]);
        this.currentPageDown = this.currentChapter;
        this.currentPageUp = this.currentChapter;
        if (this.novel.user_bookmark) {
          this.updateUserBookmark();
        }
      }, error => {
        this.router.navigate(['novelas']);
      });
    }
  }

  openDialogSheet(item): void {
    this.dialog.open(item);
  }

  openBottomSheet(item): void {
    this.bottomSheet.open(item);
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  initializeComment(comments: Array<any>) {
    for (const comment of comments) {
      comment.edition = false;
      comment.show_more = false;
      comment.show_replys = false;
      comment.liked = false;
      comment.chapter_comment_reply = null;
      comment.replys = [];
      if (this.user) {
        for (const commentLike of comment.likes) {
          if (commentLike.user_id === this.user.id) {
            comment.liked = true;
            comment.like_id = commentLike.id;
            break;
          }
        }
      }
    }
  }

  toggleTheme() {
    this.hs.openExternalFunction('toggleTheme');
  }

  getUser() {
    this.user = this.us.getUserLoged();
    console.log(this.user);
    this.novel.nvl_rated = false;
    this.novel.user_bookmark = null;
    for (const loadadChapter of this.LoadedChapters) {
      for (const comment of loadadChapter.comments) {
          comment.liked = false;
          comment.like_id = null;
      }
    }
    if (this.user) {
      for (const novelRating of this.novel.novel_ratings) {
        if (novelRating.user_id === this.user.id) {
          this.novel.nvl_rated = true;
        }
      }
      for (const novelBookmark of this.novel.bookmarks) {
        if (novelBookmark.user_id === this.user.id) {
          this.novel.user_bookmark = novelBookmark;
          break;
        }
      }
      for (const loadadChapter of this.LoadedChapters) {
        for (const comment of loadadChapter.comments) {
          for (const commentLike of comment.likes) {
            if (commentLike.user_id === this.user.id) {
              comment.liked = true;
              comment.like_id = commentLike.id;
              break;
            }
          }
        }
      }
    }
  }

  onScrollDown(event) {
    if (event.visible) {
      this.currentPageDown = this.currentPageDown + 1;
      console.log(this.currentChapter);
      if (this.allChapters[this.currentPageDown]) {
        this.loading = true;
        this.ns.getNovelChapter(this.allChapters[this.currentPageDown].id).subscribe((data: any) => {
          this.allChapters[this.currentPageDown] = data.chapter[0];
          this.initializeComment(data.chapter[0].comments);
          this.LoadedChapters.push(this.allChapters[this.currentPageDown]);
          this.loading = false;
          console.log(this.LoadedChapters);
        });
      } else {
        return;
      }
    }
  }

  onScrollUp() {
    const canLoadPortrait = false;
    this.currentPageUp = this.currentPageUp - 1;
    console.log(this.currentChapter);
    if (this.allChapters[this.currentPageUp]) {
      this.loading = true;
      if (this.currentPageUp === 0 && this.currentChapter !== 0) {
        this.currentChapter = 0;
      }
      this.ns.getNovelChapter(this.allChapters[this.currentPageUp].id).subscribe((data: any) => {
        if (this.currentChapter === 0 && !this.loadPortrait) {
          this.loadPortrait = true;
        }
        this.allChapters[this.currentPageUp] = data.chapter[0];
        this.initializeComment(data.chapter[0].comments);
        this.LoadedChapters.unshift(this.allChapters[this.currentPageUp]);
        this.loading = false;
        console.log(this.LoadedChapters);
      });
    } else {
      return;
    }
  }

  openLoginForm() {
    this.hs.openExternalFunction('loginForm');
  }

  switchBookMark() {
    if (this.novel.user_bookmark === null) {
      this.us.createUserBookmark(this.novel.id, this.chapterId).subscribe((data: any) => {
        this.novel.user_bookmark = data.bookmark;
        this.novel.bookmarks.push(data.bookmark);
      });
    } else {
      this.us.deleteUserBoomark(this.novel.user_bookmark.id).subscribe((data: any) => {
        this.novel.bookmarks.splice(this.novel.bookmarks.findIndex(x => x.id === this.novel.user_bookmark.id), 1);
        this.novel.user_bookmark = null;
      });
    }
  }

  // Comments replys

  createNovelRating() {
    this.newRatingForm.patchValue({
      novel_id: this.novel.id
    });
    this.ns.createNovelRating(this.newRatingForm.value).subscribe((data: any) => {
      this.novel.nvl_rated = true;
      this.novel.novel_ratings.push(data.novel_rating);
      this.newRatingForm.reset();
      this.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Calificación publicada!';
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  goToHome() {
    this.router.navigate(['']);
  }

  goToNovel() {
    this.router.navigate(['novelas', this.novel.id, this.novel.nvl_name]);
  }
}

import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild, ViewChildren, HostListener  } from '@angular/core';
import { Location } from '@angular/common';
import { NovelsService } from '../../services/novels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { UsersService } from '../../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, NgForm } from '@angular/forms';
import { HelperService } from '../../services/helper.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LikesService } from '../../services/likes.service';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss']
})
export class ChaptersComponent implements AfterViewInit {

  @ViewChild('mainpanel') mainpanelRef: ElementRef;

  selector = '.skn-chp-main-panel';
  novel: any = [];
  LoadedChapters = [];
  allChapters = [];
  scrolling;
  currentPageDown = null;
  currentPageUp = null;
  currentChapter = null;
  loading = false;
  loadPortrait = false;
  // lastScrollTop = 0;
  user: any = null;
  newRatingForm: FormGroup;
  newCommentForm: FormGroup;
  public newRating = {
    novel_id: null,
    rate_value: 0,
    rate_comment: null
  };
  public newComment = {
    chapter_id: null,
    chapter_comment: null
  };
  mobile: boolean;

  @ViewChildren('chaptersElement') chaptersElementRef;


  constructor(private ns: NovelsService,
              private us: UsersService,
              private ls: LikesService,
              public hs: HelperService,
              private renderer: Renderer2,
              private breakpointObserver: BreakpointObserver,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              public bottomSheet: MatBottomSheet) {}

  /*@HostListener('window:scroll', ['$event']) onScrollEvent($event){
    clearTimeout(this.scrolling);
    this.scrolling = setTimeout(() => {
      this.chaptersElementRef.forEach(chapterElementRef => {
        if (chapterElementRef.nativeElement.getBoundingClientRect().top < 350 &&
        chapterElementRef.nativeElement.getBoundingClientRect().bottom > 450) {
          this.novel.nvl_currentChapter = chapterElementRef.nativeElement.firstElementChild.firstElementChild.lastElementChild.innerText;
          this.novel.nvl_currentChapterN = chapterElementRef.nativeElement.firstElementChild.lastElementChild.lastElementChild.innerText;
          // Location
          this.location.replaceState('/novelas/' + this.novel.id + '/' + this.novel.nvl_name + '/' +
          chapterElementRef.nativeElement.firstElementChild.lastElementChild.firstElementChild.innerText + '/' +
          chapterElementRef.nativeElement.firstElementChild.firstElementChild.firstElementChild.innerText);
        }
      });
    }, 100);
  }*/

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
          chapterElementRef.nativeElement.getBoundingClientRect().bottom > 450) {
            this.novel.nvl_currentChapter = chapterElementRef.nativeElement.firstElementChild.firstElementChild.lastElementChild.innerText;
            this.novel.nvl_currentChapterN = chapterElementRef.nativeElement.firstElementChild.lastElementChild.lastElementChild.innerText;
            // Location
            this.location.replaceState('/novelas/' + this.novel.id + '/' + this.novel.nvl_name + '/' +
            chapterElementRef.nativeElement.firstElementChild.lastElementChild.firstElementChild.innerText + '/' +
            chapterElementRef.nativeElement.firstElementChild.firstElementChild.firstElementChild.innerText);
          }
        });
      }, 100);
    });
  }

  loadNovelDataChapters(id?: any) {
    this.LoadedChapters = [];
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
        this.location.replaceState('/novelas/' + this.novel.id + '/' + this.novel.nvl_name + '/' +
          data.chapter[0].id + '/' + data.chapter[0].chp_name);
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
      }, error => {
        this.router.navigate(['novelas']);
      });
    }
  }

  switchCommentLike(chapterComment) {
    if (this.user) {
      if (chapterComment.liked === false) {
        chapterComment.liked = true;
        this.ls.createChapterCommentLike(chapterComment.id).subscribe((data: any) => {
          chapterComment.like_id = data.chapter_comment_like.id;
          chapterComment.likes.push(data.chapter_comment_like);
          console.log(data.chapter_comment_like);
        }, error => {
          chapterComment.liked = false;
        });
      } else {
        chapterComment.liked = false;
        this.ls.deleteChapterCommentLike(chapterComment.like_id).subscribe((data: any) => {
          chapterComment.likes.splice(chapterComment.likes.findIndex(x => x.id === chapterComment.like_id), 1);
          chapterComment.like_id = null;
        }, error => {
          chapterComment.liked = true;
        });
      }
      console.log(chapterComment);
    } else {
      return;
    }
  }

  initializeComment(comments: Array<any>) {
    for (const comment of comments) {
      comment.edition = false;
      comment.show_more = false;
      comment.liked = false;
    }
    console.log(comments);
  }

  editComment(comments: any) {
    comments.edition = true;
  }

  updateComment(updateCommentForm: NgForm, comment: any) {
    console.log(updateCommentForm);
    if (updateCommentForm.dirty) {
      if (updateCommentForm.valid) {
        this.ns.updateChapterComment(comment).subscribe((data: any) => {
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

  deleteComment(chapter: any, comment: any) {
    this.ns.deleteChapterComment(comment.id).subscribe((data: any) => {
      chapter.comments.splice(chapter.comments.findIndex(x => x.id === comment.id), 1);
      console.log(data);
    });
  }

  createChapterComment(chapter: any) {
  console.log(this.newCommentForm);
  console.log(this.newComment);
  this.newComment.chapter_id = chapter.id;
  this.ns.createChapterComment(this.newComment).subscribe((data: any) => {
    data.chapter_comment.user_login = this.user.user_login;
    data.chapter_comment.liked = false;
    data.chapter_comment.show_more = false;
    data.chapter_comment.edition = false;
    data.chapter_comment.likes = [];
    console.log(data.chapter_comment);
    chapter.comments.push(data.chapter_comment);
  });
  console.log(this.novel);
  }

  openDialogSheet(item): void {
    this.dialog.open(item);
  }

  openBottomSheet(item): void {
    this.bottomSheet.open(item);
  }

  getUser() {
    this.user = this.us.getUserLoged();
    console.log(this.user);
    this.novel.nvl_rated = false;
    if (this.user) {
      for (const novelRating of this.novel.novel_ratings) {
        if (novelRating.user_id === this.user.id) {
          novelRating.nvl_rated = true;
        }
      }
      for (const novelBookmark of this.novel.bookmarks) {
        if (novelBookmark.user_id === this.user.id) {
          this.novel.user_bookmark = novelBookmark;
          break;
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
      this.us.createUserBookmark(this.novel.id).subscribe((data: any) => {
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

  createNovelRating() {
    console.log(this.newRatingForm);
    console.log(this.newRating);
    this.newRating.novel_id = this.novel.id;
    this.ns.createNovelRating(this.newRating).subscribe((data: any) => {
      console.log(data.novel_rating);
    });
    console.log(this.novel);
    }

  showMoreComment(comment) {
    if (comment.show_more === true) {
      comment.show_more = false;
    } else {
      comment.show_more = true;
    }
  }

  goToHome() {
    this.router.navigate(['']);
  }

  goToNovel() {
    this.router.navigate(['novelas', this.novel.id, this.novel.nvl_name]);
  }
}

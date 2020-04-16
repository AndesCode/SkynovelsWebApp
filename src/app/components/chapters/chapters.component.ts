import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild, ViewChildren  } from '@angular/core';
import { Location } from '@angular/common';
import { NovelsService } from '../../services/novels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { UsersService } from '../../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { HelperService } from '../../services/helper.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

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
  lastScrollTop = 0;
  user: any = null;
  newRatingForm: FormGroup;
  public newRating = {
    novel_id: null,
    rate_value: 0,
    rate_comment: null
  };
  mobile: boolean;

  @ViewChildren('chaptersElement') chaptersElementRef;


  constructor(private ns: NovelsService,
              private us: UsersService,
              public hs: HelperService,
              private renderer: Renderer2,
              private breakpointObserver: BreakpointObserver,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              public bottomSheet: MatBottomSheet) {}

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
          data.chapter.id + '/' + data.chapter.chp_name);
        this.allChapters[this.currentChapter] = data.chapter;
        if (this.currentChapter === 0) {
          this.loadPortrait = true;
        }
        console.log(this.allChapters[this.currentChapter]);
        this.novel.nvl_currentChapter = data.chapter.chp_index_title;
        this.novel.nvl_currentChapterN = data.chapter.chp_number;
        this.LoadedChapters.push(this.allChapters[this.currentChapter]);
        this.currentPageDown = this.currentChapter;
        this.currentPageUp = this.currentChapter;
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

  getUser() {
    this.user = this.us.getUserLoged();
    console.log(this.user);
    this.novel.nvl_rated = false;
    if (this.user) {
      for (let i = 0; i < this.novel.novel_ratings.length; i++) {
        if (this.novel.novel_ratings[i].user_id === this.user.id) {
            this.novel.nvl_rated = true;
        }
      }
      for (let i = 0; i < this.novel.bookmarks.length; i++) {
        if (this.novel.bookmarks[i].user_id === this.user.id) {
          this.novel.user_bookmark = this.novel.bookmarks[i];
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
          this.allChapters[this.currentPageDown] = data.chapter;
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
        this.allChapters[this.currentPageUp] = data.chapter;
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
      this.novel.nvl_rated = true;
      console.log(data.novel_rating);
      this.novel.novel_ratings.push(data.novel_rating);
    });
    console.log(this.novel);
  }

  goToHome() {
    this.router.navigate(['']);
  }

  goToNovel() {
    this.router.navigate(['novelas', this.novel.id, this.novel.nvl_name]);
  }
}

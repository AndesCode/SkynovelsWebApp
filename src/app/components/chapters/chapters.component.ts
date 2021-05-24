import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild, ViewChildren, TemplateRef, Inject, PLATFORM_ID  } from '@angular/core';
import { Location, isPlatformBrowser } from '@angular/common';
import { NovelsService } from '../../services/novels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperService } from '../../services/helper.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Novel, User } from 'src/app/models/models';
import { PageService } from '../../services/page.service';
import { Chapter } from '../../models/models';
import { fromEvent } from 'rxjs';

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
  textAlign = 'left';
  componentName = 'ChaptersComponent';
  isBrowser: boolean;
  chapterChangeCount = 0;
  url: string;
  canLoadPage = true;

  @ViewChildren('chaptersElement') chaptersElementRef;


  constructor(private ns: NovelsService,
              private us: UsersService,
              public hs: HelperService,
              public ps: PageService,
              private renderer: Renderer2,
              private breakpointObserver: BreakpointObserver,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId) {
                this.isBrowser = isPlatformBrowser(this.platformId);
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
    this.breakpointObserver.observe('(max-width: 1152px)').subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    });

    if (this.isBrowser) {
      if (localStorage.getItem('font')) {
        if ((Number(localStorage.getItem('font')) < 12 || Number(localStorage.getItem('font')) > 24) || isNaN(Number(localStorage.getItem('font')))) {
          localStorage.setItem('font', String(this.fontSize));
        } else {
          this.fontSize = Math.round(Number(localStorage.getItem('font')));
        }   
      }
      if (localStorage.getItem('sknChpTextAlign')) {
        if (localStorage.getItem('sknChpTextAlign') === 'left' || localStorage.getItem('sknChpTextAlign') === 'justify') {
          this.textAlign = localStorage.getItem('sknChpTextAlign');
        } else {
          localStorage.setItem('sknChpTextAlign', this.textAlign);     
        }  
      }  
    }

    this.hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'reloadUser') {
        this.getUser();
      }
    });
    const nvlId = Number(this.activatedRoute.snapshot.paramMap.get('nid'));
    this.ns.getNovelChapters(nvlId).subscribe((data: any) => {
      this.novel = data.novel[0];
      this.novel.user_bookmark = null;
      this.allChapters = this.novel.chapters;
      this.getUser();
      this.loadNovelDataChapters();
      fromEvent(window, 'popstate').subscribe((e) => {
        if (!this.ps.getBottomSheetState()) {
          while (this.chapterChangeCount > 0) {
            this.chapterChangeCount = this.chapterChangeCount - 1;
            this.location.back();
          }  
        } else {
          if (this.chapterChangeCount > 0) {
            this.router.navigate(['novelas']);
            setTimeout(() => {
              this.location.replaceState(this.url)
            }, 60);
          }
        }  
      });
    }, error => {
      this.router.navigate(['novelas']);
    });
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
            this.url = '/novelas/' + this.novel.id + '/' + this.novel.nvl_name + '/' +
            this.chapterId + '/' +
            chapterElementRef.nativeElement.firstElementChild.firstElementChild.firstElementChild.innerText
            this.location.go(this.url);
            if (this.novel.image) {
              this.hs.updateBrowserMeta(this.novel.nvl_title + ' | ' + this.novel.nvl_currentChapter, 'Sección de lectura de ' + this.novel.nvl_title, `https://api.skynovels.net/api/get-image/${this.novel.image}/novels/false`);
            } else {
              this.hs.updateBrowserMeta(this.novel.nvl_title + ' | ' + this.novel.nvl_currentChapter, 'Sección de lectura de ' + this.novel.nvl_title, null);
            }
            this.chapterChangeCount = this.chapterChangeCount + 1
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
    if (value === 'substract' && this.fontSize > 12) {
      this.fontSize = this.fontSize - 1;    
    }
    if (this.isBrowser) {
      localStorage.setItem('font', String(this.fontSize));
    } 
  }

  TextAlignChanged() {
    if (this.isBrowser) {
      localStorage.setItem('sknChpTextAlign', this.textAlign);
    } 
  }

  updateUserBookmark() {
    this.novel.user_bookmark.chp_id = this.chapterId;
    this.us.updateUserBookmark(this.novel.user_bookmark).subscribe((data: any) => {
    }, error => {
      this.ps.openMatSnackBar(this.errorSnackRef);
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
    this.currentChapter = this.allChapters.findIndex(x => x.id === Number(chpId));
    if (this.currentChapter === -1) {
      this.router.navigate(['novelas', this.novel.id, this.novel.nvl_name]);
    } else {
      this.ns.getNovelChapter(chpId).subscribe((data: any) => {
        if (this.novel.image) {
          this.hs.updateBrowserMeta(this.novel.nvl_title + ' | ' + data.chapter[0].chp_index_title, 'Sección de lectura de ' + this.novel.nvl_title, `https://api.skynovels.net/api/get-image/${this.novel.image}/novels/false`);
        } else {
          this.hs.updateBrowserMeta(this.novel.nvl_title + ' | ' + data.chapter[0].chp_index_title, 'Sección de lectura de ' + this.novel.nvl_title, null);
        }
        this.chapterId = Number(data.chapter[0].id);
        this.location.replaceState('/novelas/' + this.novel.id + '/' + this.novel.nvl_name + '/' + this.chapterId + '/' + data.chapter[0].chp_name);
        this.allChapters[this.currentChapter] = data.chapter[0];
        if (this.currentChapter === 0) {
          this.loadPortrait = true;
        }
        this.chapterContentArrayFill(data.chapter[0]);
        this.initializeComment(data.chapter[0].comments);
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

  initializeComment(comments: Array<any>) {
    for (const comment of comments) {
      comment.edition = false;
      comment.show_more = false;
      comment.show_replys = false;
      comment.liked = false;
      comment.chapter_comment_reply = null;
      comment.replys = [];
      comment.reply = null;
      comment.replys_count = 0;
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

  chapterContentArrayFill(chapter) {
    //console.log(chapter.chp_content);
    let breakLineCharacter
    if (chapter.chp_content.search('\n') === -1) {
      // console.log('esta en html')
      if (chapter.chp_content.search('<br />') === -1) {
        // console.log('esta en <br />')
        breakLineCharacter = '<br>'
      } else {
        // console.log('esta en <br />')
        breakLineCharacter = '<br />'
      }
    } else {
      // console.log('esta en ºn')
      breakLineCharacter = '\n'
    }
    const chpContentSub = chapter.chp_content.split(breakLineCharacter);
    if (chpContentSub.length <= 279) {
      const paragraphAdLocation = Math.round(chpContentSub.length / 2);
      const string1 = [];
      for (let i = 0; i < paragraphAdLocation; i++) {
        string1.push(chpContentSub[i]);
      }
      chpContentSub.splice(0, paragraphAdLocation);
      const string2 = chpContentSub.join(breakLineCharacter);
      chapter.chp_content_array = [string1.join(breakLineCharacter), string2];
    } else {
      const paragraphAdLocation = Math.round(chpContentSub.length / 3) + 1;
      const string1 = [];
      const string2 = [];
      for (let i = 0; i < paragraphAdLocation; i++) {
        string1.push(chpContentSub[i]);
      }
      chpContentSub.splice(0, paragraphAdLocation);
      for (let i = 0; i < paragraphAdLocation; i++) {
        string2.push(chpContentSub[i]);
      }
      chpContentSub.splice(0, paragraphAdLocation);
      const string3 = chpContentSub.join(breakLineCharacter);
      chapter.chp_content_array = [string1.join(breakLineCharacter), string2.join(breakLineCharacter), string3];
    }

  }

  toggleTheme() {
    this.hs.openExternalFunction('toggleTheme');
  }

  getUser() {
    this.user = this.us.getUserLoged();
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

  canLoadPageRefresh() {
    setTimeout(() => {
      this.canLoadPage = true;
    }, 1000);
  }

  onScrollDown(event) {
    if (event.visible && this.canLoadPage) {
      this.canLoadPage = false;
      this.canLoadPageRefresh();
      this.currentPageDown = this.currentPageDown + 1;
      if (this.allChapters[this.currentPageDown]) {
        this.loading = true;
        this.ns.getNovelChapter(this.allChapters[this.currentPageDown].id).subscribe((data: any) => {
          this.allChapters[this.currentPageDown] = data.chapter[0];
          this.chapterContentArrayFill(data.chapter[0]);
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
    this.currentPageUp = this.currentPageUp - 1;
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
        this.chapterContentArrayFill(data.chapter[0]);
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
      this.ps.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Calificación publicada!';
    }, error => {
      this.ps.openMatSnackBar(this.errorSnackRef);
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

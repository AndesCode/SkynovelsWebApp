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
import { LikesService } from '../../services/likes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Like } from 'src/app/models/models';

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
  newComment: FormGroup;
  mobile: boolean;
  newCommentReply: FormGroup;

  @ViewChildren('chaptersElement') chaptersElementRef;


  constructor(private ns: NovelsService,
              private us: UsersService,
              private ls: LikesService,
              public hs: HelperService,
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
                  rate_comment: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(1500)]),
                });

                this.newComment = new FormGroup({
                  chapter_id: new FormControl(''),
                  chapter_comment: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]),
                });

                this.newCommentReply = new FormGroup({
                  chapter_comment_id: new FormControl(''),
                  chapter_comment_reply: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]),
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

  openDialogSheet(item): void {
    this.dialog.open(item);
  }

  openBottomSheet(item): void {
    this.bottomSheet.open(item);
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  switchCommentLike(chapterComment) {
    if (this.user) {
      if (chapterComment.liked === false) {
        chapterComment.liked = true;
        const like: Like = {
          chapter_comment_id: chapterComment.id
        };
        this.ls.createLike(like).subscribe((data: any) => {
          chapterComment.like_id = data.like.id;
          chapterComment.likes.push(data.like);
        }, error => {
          chapterComment.liked = false;
        });
      } else {
        chapterComment.liked = false;
        this.ls.deleteLike(chapterComment.like_id).subscribe((data: any) => {
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

  switchCommentReplyLike(chapterCommentReply) {
    if (this.user) {
      if (chapterCommentReply.liked === false) {
        chapterCommentReply.liked = true;
        const like: Like = {
          chapter_comment_reply_id: chapterCommentReply.id
        };
        this.ls.createLike(like).subscribe((data: any) => {
          chapterCommentReply.like_id = data.like.id;
          chapterCommentReply.likes.push(data.like);
        }, error => {
          chapterCommentReply.liked = false;
        });
      } else {
        chapterCommentReply.liked = false;
        this.ls.deleteLike(chapterCommentReply.like_id).subscribe((data: any) => {
          chapterCommentReply.likes.splice(chapterCommentReply.likes.findIndex(x => x.id === chapterCommentReply.like_id), 1);
          chapterCommentReply.like_id = null;
        }, error => {
          chapterCommentReply.liked = true;
        });
      }
      console.log(chapterCommentReply);
    } else {
      return;
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
      for (const commentLike of comment.likes) {
        if (commentLike.user_id === this.user.id) {
          comment.liked = true;
          comment.like_id = commentLike.id;
          break;
        }
      }
    }
    console.log(comments);
  }

  editComment(comments: any) {
    comments.edition = true;
  }

  toggleTheme() {
    this.hs.openExternalFunction('toggleTheme');
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
  this.newComment.patchValue({
    chapter_id: chapter.id
  });
  this.ns.createChapterComment(this.newComment.value).subscribe((data: any) => {
    data.chapter_comment.user_login = this.user.user_login;
    data.chapter_comment.liked = false;
    data.chapter_comment.show_more = false;
    data.chapter_comment.edition = false;
    data.chapter_comment.likes = [];
    data.chapter_comment.replys = [];
    console.log(data.chapter_comment);
    chapter.comments.push(data.chapter_comment);
  });
  console.log(this.novel);
  }

  getUser() {
    this.user = this.us.getUserLoged();
    console.log(this.user);
    this.novel.nvl_rated = false;
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

  // Comments replys

  createChapterCommentReply(comment: any) {
    const newCommentReply = {
      chapter_comment_id: comment.id,
      chapter_comment_reply: comment.chapter_comment_reply
    };
    console.log(newCommentReply);
    this.ns.createChapterCommentReply(newCommentReply).subscribe((data: any) => {
      data.chapter_comment_reply.user_login = this.user.user_login;
      data.chapter_comment_reply.liked = false;
      data.chapter_comment_reply.show_more = false;
      data.chapter_comment_reply.edition = false;
      data.chapter_comment_reply.likes = [];
      data.chapter_comment_reply.date_data = this.hs.getRelativeTime(data.chapter_comment_reply.createdAt);
      comment.replys.unshift(data.chapter_comment_reply);
      console.log(comment);
      comment.chapter_comment_reply = null;
    });
  }

  getChapterCommentReplys(ChapterComment: any) {
    if (ChapterComment.replys.length > 0) {
      ChapterComment.show_replys = true;
    } else {
      this.ns.getChapterCommentReplys(ChapterComment.id).subscribe((data: any) => {
        ChapterComment.replys = data.chapter_comment_replys;
        console.log(ChapterComment.replys);
        for (const CommentReply of ChapterComment.replys) {
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
        console.log(ChapterComment);
        ChapterComment.show_replys = true;
        ChapterComment.replys.sort(this.hs.dateDataSorter);
      });
    }
  }

  hideChapterCommentReplys(ChapterComment: any) {
    ChapterComment.show_replys = false;
  }

  updateChapterCommentReply(updateChapterCommentReplyForm: NgForm, commentReply: any) {
    console.log(updateChapterCommentReplyForm);
    if (updateChapterCommentReplyForm.dirty) {
      if (updateChapterCommentReplyForm.valid) {
        this.ns.updateChapterCommentReply(commentReply).subscribe((data: any) => {
          console.log(data);
          commentReply.edition = false;
        });
      } else {
        commentReply.edition = false;
      }
    } else {
      commentReply.edition = false;
    }
  }

  deleteChapterCommentReply(comment: any, commentReply: any) {
    this.ns.deleteChapterCommentReply(commentReply.id).subscribe((data: any) => {
      comment.replys.splice(comment.replys.findIndex(x => x.id === commentReply.id), 1);
      console.log(data);
    });
  }

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

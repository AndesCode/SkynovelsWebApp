import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chapter, Novel, User } from 'src/app/models/models';
import { HelperService } from 'src/app/services/helper.service';
import { NovelsService } from 'src/app/services/novels.service';
import { Location, isPlatformBrowser } from '@angular/common';
import { PageService } from 'src/app/services/page.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-chapter-comment',
  templateUrl: './chapter-comment.component.html',
  styleUrls: ['./chapter-comment.component.scss']
})
export class ChapterCommentComponent implements OnInit {

  novel: Novel;
  chapter: Chapter;
  user: User = null;
  loading = true;
  queryComment: string = null;
  queryReply: string = null;

  constructor(private activatedRoute: ActivatedRoute,
              private ns: NovelsService,
              public hs: HelperService,
              private location: Location,
              private router: Router,
              public ps: PageService,
              private us: UsersService,) { }

  ngOnInit(): void {

  this.hs.invokeExternalFunction.subscribe((data: any) => {
    if (data === 'reloadUser') {
      this.getUser();
    }
  });

  const chpId = Number(this.activatedRoute.snapshot.paramMap.get('cid'));
  this.activatedRoute.queryParamMap.subscribe((params: any) => {
    if (params.params.comment) {
      this.queryComment = params.params.comment;
    }
    if (params.params.reply) {
      this.queryReply = params.params.reply;
    }
  });
  this.ns.getNovelChapter(chpId).subscribe((data: any) => {
    /*if (this.novel.image) {
      this.hs.updateBrowserMeta(this.novel.nvl_title + ' | ' + data.chapter[0].chp_index_title, 'Sección de lectura de ' + this.novel.nvl_title, `https://api.skynovels.net/api/get-image/${this.novel.image}/novels/false`);
    } else {
      this.hs.updateBrowserMeta(this.novel.nvl_title + ' | ' + data.chapter[0].chp_index_title, 'Sección de lectura de ' + this.novel.nvl_title, null);
    }*/
    this.chapter = data.chapter[0];
    this.location.replaceState('/comentarios-de-capitulo/' + data.chapter[0].id);
    this.initializeComment(data.chapter[0].comments);
    this.getUser();
    this.loading = false;
    if (this.queryComment !== null) {
      setTimeout(() => {
        const commentElement = document.getElementById('comment_' + this.queryComment);
        
        if (this.queryReply !== null) {
          const comment = this.chapter.comments[this.chapter.comments.findIndex(x => x.id === Number(this.queryComment))];
          comment.show_replys = true;
          this.ps.getReplysFunction(this.user, comment, 'comment_id', 'reply_' + this.queryReply);
          setTimeout(() => {
          const replyElement = document.getElementById('reply_' + this.queryReply);
          replyElement.scrollIntoView();
          }, 200);
        } else {
          commentElement.scrollIntoView();
        }
      }, 500);

    }
  }, error => {
    this.router.navigate(['']);
  });

  }

  getUser() {
    this.user = this.us.getUserLoged();
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
      // comment.replys_count = 0;
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

}

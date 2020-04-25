import { Component, OnInit} from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Post } from 'src/app/models/post';
import { ActivatedRoute, Router } from '@angular/router';
import { PostComment } from 'src/app/models/post-comment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForumService } from '../../../../services/forum.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { UsersService } from '../../../../services/users.service';
import { HelperService } from '../../../../services/helper.service';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss']
})

export class ForumPostComponent implements OnInit {

  post: any = {};
  user: any = null;
  public Editor = ClassicEditor;
  reply = {
    forum_post_id: null,
    comment_content: null
  };
  stickyReply = false;

  constructor ( private modalService: NgbModal,
                private activatedRoute: ActivatedRoute,
                private _fs: ForumService,
                private location: Location,
                private _us: UsersService,
                public _as: AdminService,
                private router: Router,
                public _hs: HelperService) {}

  ngOnInit(): void {
    this._hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'reloadUser') {
        this.getUser();
      }
    });
    const url_id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('cargando componente forum post');
    this._fs.getForumPost(url_id).subscribe((data: any) => {
      this.post = data.post;
      this.post.edition = false;
      if (this.post.post_comments && this.post.post_comments.length > 0) {
        for (let i = 0; i < this.post.post_comments.length; i++) {
          this.post.post_comments[i].edition = false;
        }
      }
      let urlPostName = this.post.post_title.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
      urlPostName = urlPostName.split(' ').join('-');
      urlPostName = urlPostName.toLowerCase();
      // tslint:disable-next-line: max-line-length
      this.location.go('/foro/' + this.post.forum_category.category_name + '/' + this.post.forum_category_id + '/' + urlPostName + '/' + this.post.id);
      console.log(this.post);
      this.getUser();
    }, error => {
      this.router.navigate(['/foro']);
    });
  }

  getUser() {
    this.user = this._us.getUserLoged();
    console.log(this.user);
  }

  openSm(content: any) {
    this.modalService.open(content, { size: 'sm' });
  }

  editPost() {
    this.post.edition = true;
  }

  editComment(comment_id: any) {
    const comment = this.post.post_comments.find(x => x.id === comment_id);
    comment.edition = true;
  }

  updatePost(postForm: NgForm) {
    console.log(postForm);
    if (postForm.dirty) {
      this._fs.updateForumPost(this.post).subscribe((data: any) => {
        console.log(data);
        postForm.reset(postForm.value);
        this.post.edition = false;
      });
    } else {
      this.post.edition = false;
      return;
    }
  }

  pinPost() {
    const post = {
      id: this.post.id,
      post_pinned: this.post.post_pinned
    };
    if (this.post.post_pinned) {
      post.post_pinned = false;
    } else {
      post.post_pinned = true;
    }
    this._as.adminUpdateForumPost(this._us.getUserLoged().token, post).subscribe((data: any) => {
      this.post.post_pinned = data.post.post_pinned;
    });
  }

  createComment(replyForm: NgForm) {
    if (replyForm.valid) {
      this.reply.forum_post_id = this.post.id;
      this._fs.createComment(this.reply).subscribe((data: any) => {
        data.post_comment.user = {
          user_login: this.user.user_login,
          forum_posts: this.user.forum_posts
        };
        this.post.post_comments.push(data.post_comment);
        this.reply.forum_post_id = null;
        this.reply.comment_content = null;
        this.stickyReply = false;
      });
    } else {
      return;
    }
  }

  swichStickyReply(action: string) {
    if (action === 'open') {
      this.stickyReply = true;
    } else {
      this.stickyReply = false;
      this.reply.comment_content = null;
    }
  }

  quoteReply(quote?: any, user?: Text) {
    if (quote) {
      quote = quote.replace(/<[^>]*>?/gm, '');
      this.reply.comment_content = '<blockquote>' + user + ': <br><br>' + quote + '</blockquote> <br>';
    }
  }

  updateComment(comment_id: any, commentForm: NgForm) {
    console.log(commentForm);
    const comment = this.post.post_comments.find(x => x.id === comment_id);
    if (commentForm.dirty) {
      this._fs.updatePostComment(comment).subscribe((data: any) => {
        console.log(data);
        commentForm.reset(commentForm.value);
        comment.edition = false;
      });
    } else {
      comment.edition = false;
      return;
    }
  }

  deleteComment(comment: any) {
    this._fs.deleteComment(comment.id).subscribe((data: any) => {
      this.post.post_comments.splice(this.post.post_comments.findIndex(x => x.id === comment.id), 1);
    }, error => {
      console.log(error);
    });
  }

  deletePost() {
    this._fs.deleteForumPost(this.post.id).subscribe((data: any) => {
      console.log(data);
      this.goToCategory();
    });
  }

  goToLink(link: string) {
    this.router.navigate([link]);
  }

  goToCategory() {
    this.router.navigate(['/foro', this.post.forum_category.category_name, this.post.forum_category_id]);
  }
}

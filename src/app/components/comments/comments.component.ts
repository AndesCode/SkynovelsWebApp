import { Component, Input, OnInit } from '@angular/core';
import { Comment, User } from 'src/app/models/models';
import { HelperService } from 'src/app/services/helper.service';
import { PageService } from 'src/app/services/page.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() comments: Array<Comment>
  user: User;
  object = {};
  constructor(private us: UsersService,
              public hs: HelperService,
              public ps: PageService) { }

  ngOnInit(): void {
    this.hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'reloadUser') {
        this.getUser();
      }
    });
    for (const comment of  this.comments) {
      comment.show_more = false;
      comment.edition = false;
      comment.show_replys = false;
      comment.replys = [];
      comment.reply = null;
    }
    this.getUser();
    this.object = {
      comments: this.comments
    };
  }

  getUser() {
    this.user = this.us.getUserLoged();
    for (const comment of this.comments) {
      comment.liked = false;
      comment.like_id = null;
      for (const commentReply of comment.replys) {
        commentReply.liked = false;
        commentReply.like_id = null;
      }
      if (this.user) {
        for (const commentLike of  comment.likes) {
          if (commentLike.user_id === this.user.id) {
            comment.liked = true;
            comment.like_id = commentLike.id;
            break;
          }
        }
        for (const commentReply of comment.replys) {
          for (const commentReplyLike of commentReply.likes) {
            if (commentReplyLike.user_id === this.user.id) {
              commentReply.liked = true;
              commentReply.like_id = commentReplyLike.id;
              break;
            }
          }
        }
      }
    }
  }

}

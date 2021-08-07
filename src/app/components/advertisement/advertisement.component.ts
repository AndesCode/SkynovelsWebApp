import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Advertisement, User } from 'src/app/models/models';
import { HelperService } from '../../services/helper.service';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss']
})
export class AdvertisementComponent implements OnInit {

  advertisement: Advertisement;
  loading = true;
  user: User;
  componentName = 'AdvertisementComponent';
  queryComment: string = null;
  queryReply: string = null;

  constructor(private us: UsersService,
              public ps: PageService,
              public hs: HelperService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location) {}

  ngOnInit(): void {
    this.hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'reloadUser') {
        this.getUser();
      }
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    // Notificaciones
    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      if (params.params.comment) {
        this.queryComment = params.params.comment;
      }
      if (params.params.reply) {
        this.queryReply = params.params.reply;
      }
    });
    this.ps.getAdvertisement(Number(id)).subscribe((data: any) => {
      this.advertisement = data.advertisement;
      this.location.replaceState('/noticias/' + this.advertisement.id + '/' + this.advertisement.adv_name);
      for (const comment of  this.advertisement.comments) {
        comment.show_more = false;
        comment.edition = false;
        comment.show_replys = false;
        comment.replys = [];
        comment.reply = null;
      }
      this.getUser();
      this.loading = false;
      this.hs.updateBrowserMeta('SkyNovels | ' + this.advertisement.adv_title, 'Anuncio de Skynovels, ' + this.advertisement.adv_title, 'https://api.skynovels.net/img/banner1.jpg');
            // Notificaciones
            if (this.queryComment !== null) {
              setTimeout(() => {
                const commentElement = document.getElementById('comment_' + this.queryComment);
                
                if (this.queryReply !== null) {
                  const comment = this.advertisement.comments[this.advertisement.comments.findIndex(x => x.id === Number(this.queryComment))];
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
    this.advertisement.liked = false;
    this.advertisement.like_id = null;
    if (this.user) {
      for (const advertisementLike of  this.advertisement.likes) {
        if (advertisementLike.user_id === this.user.id) {
          this.advertisement.liked = true;
          this.advertisement.like_id = advertisementLike.id;
          break;
        }
      }
    }
    for (const advertisementComment of this.advertisement.comments) {
      advertisementComment.liked = false;
      advertisementComment.like_id = null;
      for (const advertisementCommentReply of advertisementComment.replys) {
        advertisementCommentReply.liked = false;
        advertisementCommentReply.like_id = null;
      }
      if (this.user) {
        for (const advertisementCommentLike of  advertisementComment.likes) {
          if (advertisementCommentLike.user_id === this.user.id) {
            advertisementComment.liked = true;
            advertisementComment.like_id = advertisementCommentLike.id;
            break;
          }
        }
        for (const advertisementCommentReply of advertisementComment.replys) {
          for (const advertisementCommentReplyLike of advertisementCommentReply.likes) {
            if (advertisementCommentReplyLike.user_id === this.user.id) {
              advertisementCommentReply.liked = true;
              advertisementCommentReply.like_id = advertisementCommentReplyLike.id;
              break;
            }
          }
        }
      }
    }
  }
}

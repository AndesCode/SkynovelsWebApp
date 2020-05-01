import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  public fileToUpload: File = null;
  public image_selected: string;
  public imagePath;
  public imgURL: any = '../../../assets/img/noimage.jpg';
  public userData: any = {};
  public Editor = ClassicEditor;
  current_window = 'profile';
  user_data: any = [];
  editable_profile = false;
  active_tab = 'activity';

  constructor(private activatedRoute: ActivatedRoute,
              private _us: UsersService,
              private router: Router,
              public _hs: HelperService) {}

  ngOnInit(): void {
    const urlId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this._us.getUser(urlId).subscribe((data: any) => {
      // let activityArray = [];
      this.user_data = data;
      this.user_data.activityArray = [];
      if (data.self_user) {
        this.editable_profile = true;
      }
      for (let i = 0; i < this.user_data.chapters.length; i++) {
        this.user_data.chapters[i].date_data = this._hs.getRelativeTime(this.user_data.chapters[i].createdAt, null, 'short');
        if (this.user_data.chapters[i].date_data && this.user_data.chapters[i].date_data.seconds < 5184000) {
          console.log('agregar');
          this.user_data.chapters[i].activity_type = 'chapter';
          this.user_data.activityArray.push(this.user_data.chapters[i]);
        }
      }
      for (let i = 0; i < this.user_data.novels.length; i++) {
        this.user_data.novels[i].date_data = this._hs.getRelativeTime(this.user_data.novels[i].createdAt, null, 'short');
        if (this.user_data.novels[i].date_data && this.user_data.novels[i].date_data.seconds < 5184000) {
          console.log('agregar');
          this.user_data.novels[i].activity_type = 'novels';
          this.user_data.activityArray.push(this.user_data.novels[i]);
        }
      }
      for (let i = 0; i < this.user_data.forum_posts.length; i++) {
        this.user_data.forum_posts[i].date_data = this._hs.getRelativeTime(this.user_data.forum_posts[i].createdAt, null, 'short');
        if (this.user_data.forum_posts[i].date_data && this.user_data.forum_posts[i].date_data.seconds < 5184000) {
          console.log('agregar');
          this.user_data.forum_posts[i].activity_type = 'forum_post';
          this.user_data.forum_posts[i].post_name = this.user_data.forum_posts[i].post_title.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
          this.user_data.forum_posts[i].post_name = this.user_data.forum_posts[i].post_name.split(' ').join('-');
          this.user_data.forum_posts[i].post_name = this.user_data.forum_posts[i].post_name.toLowerCase();
          this.user_data.activityArray.push(this.user_data.forum_posts[i]);
        }
      }
      for (let i = 0; i < this.user_data.posts_comments.length; i++) {
        this.user_data.posts_comments[i].date_data = this._hs.getRelativeTime(this.user_data.posts_comments[i].createdAt, null, 'short');
        if (this.user_data.posts_comments[i].date_data && this.user_data.posts_comments[i].date_data.seconds < 5184000) {
          console.log('agregar');
          this.user_data.posts_comments[i].activity_type = 'posts_comments';
          // tslint:disable-next-line: max-line-length
          this.user_data.posts_comments[i].post.post_name = this.user_data.posts_comments[i].post.post_title.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
          this.user_data.posts_comments[i].post.post_name = this.user_data.posts_comments[i].post.post_name.split(' ').join('-');
          this.user_data.posts_comments[i].post.post_name = this.user_data.posts_comments[i].post.post_name.toLowerCase();
          this.user_data.activityArray.push(this.user_data.posts_comments[i]);
        }
      }
      console.log(data);
      this.user_data.activityArray.sort(this._hs.forumAcitivitySorter);
    }, error => {
      this.router.navigate(['']);
    });
  }

  switchTab(tab: string) {
    this.active_tab = tab;
  }
}

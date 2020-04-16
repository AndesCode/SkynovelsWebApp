import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ForumService } from '../../services/forum.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {
  categories: any = [];
  forumTotalPosts: any = [];
  activityArray: any = [];
  currentTab = 'categories';
  constructor(private _router: Router,
              private _hs: HelperService,
              private _fs: ForumService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this._fs.getForumCategories().subscribe((data: any) => {
      this.categories = data.forum_categories;
      for (let i = 0; i < this.categories.length; i++) {
        for (let j = 0; j < this.categories[i].forum_posts.length; j++) {
          this.forumTotalPosts.push(this.categories[i].forum_posts[j]);
          this.categories[i].forum_posts[j].date_data = this._hs.getRelativeTime(this.categories[i].forum_posts[j].createdAt);
          if (this.categories[i].forum_posts[j].date_data && this.categories[i].forum_posts[j].date_data.seconds < 1296000) {
            console.log('agregar');
            this.categories[i].forum_posts[j].activity_type = 'post';
            this.activityArray.push(this.categories[i].forum_posts[j]);
          }
          for (let k = 0; k < this.categories[i].forum_posts[j].post_comments.length; k++) {
            this.categories[i].forum_posts[j].post_comments[k].post_title = this.categories[i].forum_posts[j].post_title;
            // tslint:disable-next-line: max-line-length
            this.categories[i].forum_posts[j].post_comments[k].date_data = this._hs.getRelativeTime(this.categories[i].forum_posts[j].post_comments[k].createdAt);
            // tslint:disable-next-line: max-line-length
            if (this.categories[i].forum_posts[j].post_comments[k].date_data && this.categories[i].forum_posts[j].post_comments[k].date_data.seconds < 1296000) {
              console.log('agregar');
              this.categories[i].forum_posts[j].post_comments[k].activity_type = 'comment';
              this.activityArray.push(this.categories[i].forum_posts[j].post_comments[k]);
            }
          }
        }
      }
      /*for (let i = 0; i < this.activityArray.length; i++) {
        this.activityArray[i].date_data = this._hs.getDiferenceInDaysBetweenDays(this.activityArray[i].createdAt, null);
        /*if (this.activityArray[i].date_data.creation_date_days > 15) {
          delete this.activityArray[i];
        }
      }*/
      this.activityArray.sort(this._hs.forumAcitivitySorter);
      console.log(this.categories);
      console.log(this.forumTotalPosts);
      console.log(this.activityArray);
    });
  }
  goToCategory(category: any ) {
    console.log(category);
    this._router.navigate(['/foro', category.category_name, category.id]);
  }
  navegarPost(type: any , id: any) {
    this._router.navigate(['/foro' , type, id]);
  }

  switchTab(tab: string) {
    this.currentTab = tab;
  }

  goToUserProfile(id: any) {
    this._router.navigate(['/perfil-de-usuario', id]);
  }
 }

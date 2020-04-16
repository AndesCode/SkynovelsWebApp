import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ForumService } from '../../../services/forum.service';
import { HelperService } from '../../../services/helper.service';
import { UsersService } from '../../../services/users.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-forum-category',
  templateUrl: './forum-category.component.html',
  styleUrls: ['./forum-category.component.scss']
})
export class ForumCategoryComponent implements OnInit {
  edition = false;
  forum: any = [];
  category: any = [];
  user = null;
  config = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: this.forum.count
  };
  post: any = {
    post_content: '',
    post_title: ''
  };
  public Editor = ClassicEditor;

    constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public _auth: AuthService,
      private _fs: ForumService,
      private _hs: HelperService,
      public _us: UsersService,
      private location: Location) {}
      cp: Number = 1;

  ngOnInit(): void {
    this._hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'reloadUser') {
        this.getUser();
      }
    });
    const category_id = this.activatedRoute.snapshot.paramMap.get('cid');
    this._fs.getForumCategory(category_id).subscribe((data: any) => {
      console.log(data);
      this.category = data.forum_category;
      this.location.go('/foro/' + this.category.category_name + '/' + category_id);
      for (let i = 0; i < this.category.forum_posts.length; i++) {
        if (this.category.forum_posts[i].post_comments.length > 0) {
          for (let j = 0; j < this.category.forum_posts[i].post_comments.length; j++) {
            // tslint:disable-next-line: max-line-length
            this.category.forum_posts[i].post_comments[j].date_data = this._hs.getRelativeTime(this.category.forum_posts[i].post_comments[j].createdAt, null, 'short');
          }
          this.category.forum_posts[i].post_comments.sort(this._hs.dateDataSorter);
          this.category.forum_posts[i].date_data = this.category.forum_posts[i].post_comments[0].date_data;
        } else {
          // tslint:disable-next-line: max-line-length
          this.category.forum_posts[i].date_data = this._hs.getRelativeTime(this.category.forum_posts[i].createdAt, null, 'short');
        }
      }
      this.category.forum_posts.sort(this._hs.dateDataSorter);
      this.category.forum_posts.sort(this._hs.pinnedForumPostDataSorter);
      console.log(this.category);
      this.getUser();
    }, error => {
      this.router.navigate(['/foro']);
    });
  }

  getUser() {
    this.user = this._us.getUserLoged();
    if (this.user === null && this.edition === true) {
      this.edition = false;
    }
    console.log(this.user);
  }

  goToNewTopic() {
    this.router.navigate(['/foro' , this.category, 'crear_publicacion', 'nuevo']);
  }

  goToUserProfile(id: any) {
    this.router.navigate(['/perfil-de-usuario', id]);
  }

  goToLink(link: string) {
    this.router.navigate([link]);
  }

  goToPost(post: any) {
    let urlPostName = post.post_title.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
    urlPostName = urlPostName.split(' ').join('-');
    urlPostName = urlPostName.toLowerCase();
    this.router.navigate(['/foro', this.category.category_name, this.category.id, urlPostName, post.id]);
  }

  goToPostCreation() {
    if (this.edition === true) {
      this.edition = false;
    } else {
      this.edition = true;
    }
  }

  createPost() {
    this.post.forum_category_id = this.category.id;
    this._fs.createForumPost(this.post).subscribe((data: any) => {
      console.log(data);
      this.goToPost(data.post);
    });
  }
}

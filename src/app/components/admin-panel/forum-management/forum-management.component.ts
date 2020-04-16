import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../../services/admin.service';
import { UsersService } from '../../../services/users.service';
import { HelperService } from '../../../services/helper.service';
import { ForumService } from '../../../services/forum.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-forum-management',
  templateUrl: './forum-management.component.html',
  styleUrls: ['./forum-management.component.scss']
})
export class ForumManagementComponent implements OnInit {
  currentTab = 'posts';
  forum_posts = [];
  forum_categories = [];
  searchText;
  current_page = 1;
  post: any = null;
  new_category_form = false;
  new_category: any = {};

  public Editor = ClassicEditor;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private _as: AdminService,
    private _us: UsersService,
    public _hs: HelperService,
    private _fs: ForumService,
    private location: Location,

  ) { }

  openSm(content: any) {
    this.modalService.open(content, { size: 'sm' });
  }

  ngOnInit(): void {
    this._as.adminGetForumPosts(this._us.getUserLoged().token).subscribe((data: any) => {
      this.forum_posts = data.forum_posts;
      console.log(this.forum_posts);
      for (let i = 0; i <  this.forum_posts.length; i++) {
        this.forum_posts[i].date_data = this._hs.getRelativeTime(this.forum_posts[i].createdAt, null, 'short');
      }
      this.forum_posts = this.forum_posts.sort(this._hs.dateDataSorter);
      const url_id = this.activatedRoute.snapshot.paramMap.get('id');
      if (url_id) {
        this.getPost(url_id);
      }
    });
    this._as.adminGetCategories(this._us.getUserLoged().token).subscribe((data: any) => {
      this.forum_categories = data.forum_categories;
      for (let i = 0; i < this.forum_categories.length; i++) {
        this.forum_categories[i].edition = false;
      }
      console.log(this.forum_categories);
    });
  }

  goBackToPosts() {
    this.post = null;
    this.location.go('/panel/administracion-del-foro');
  }

  getPost(id: any) {
    this._fs.getForumPost(id).subscribe((data: any) => {
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
      this.location.go('/panel/administracion-del-foro/' + this.post.id);
      console.log(this.post);
    }, error => {
      this.location.go('/panel/administracion-del-foro');
    });
  }

  swichtTab(tab: string) {
    this.currentTab = tab;
  }

  editPost() {
    this.post.edition = true;
  }

  newCategory() {
    this.new_category_form = true;
  }

  closeNewCategory() {
    this.new_category_form = false;
  }

  editComment(comment_id: any) {
    const comment = this.post.post_comments.find(x => x.id === comment_id);
    comment.edition = true;
  }

  savePost(postForm: NgForm) {
    console.log(postForm);
    if (postForm.dirty) {
      this._as.adminUpdateForumPost(this._us.getUserLoged().token, this.post).subscribe((data: any) => {
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
    if (this.post.post_pinned) {
      this.post.post_pinned = false;
    } else {
      this.post.post_pinned = true;
    }
    const post = {
      id: this.post.id,
      post_pinned: this.post.post_pinned
    };
    this._as.adminUpdateForumPost(this._us.getUserLoged().token, post).subscribe((data: any) => {
    });
  }

  updateComment(comment_id: any, commentForm: NgForm) {
    console.log(commentForm);
    const comment = this.post.post_comments.find(x => x.id === comment_id);
    if (commentForm.dirty) {
      this._as.adminUpdatePostComment(this._us.getUserLoged().token, comment).subscribe((data: any) => {
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
    this._as.adminDeletePostComment(this._us.getUserLoged().token, comment.id).subscribe((data: any) => {
      this.post.post_comments.splice(this.post.post_comments.findIndex(x => x.id === comment.id), 1);
    }, error => {
      console.log(error);
    });
  }

  deletePost() {
    this._as.adminDeleteForumPost(this._us.getUserLoged().token, this.post.id).subscribe((data: any) => {
      console.log(data);
    });
  }

  editCategory(category_id: any) {
    const category = this.forum_categories.find(x => x.id === category_id);
    category.edition = true;
  }

  createCategory(newCategoryForm: NgForm) {
    if (newCategoryForm.valid) {
      this._as.adminCreateCategory(this._us.getUserLoged().token, this.new_category).subscribe((data: any) => {
        this.forum_categories.push(data.forum_category);
        this.new_category_form = false;
        newCategoryForm.reset();
      });
    } else {
      return;
    }
  }

  updateCategory(category_id, categoryForm: NgForm) {
    console.log(categoryForm);
    const category = this.forum_categories.find(x => x.id === category_id);
    if (categoryForm.dirty) {
      this._as.adminUpdateCategory(this._us.getUserLoged().token, category).subscribe((data: any) => {
        console.log(data);
        categoryForm.reset(categoryForm.value);
        category.edition = false;
      });
    } else {
      category.edition = false;
      return;
    }
  }

  deleteCategory(category: any) {
    this._as.adminDeleteCategory(this._us.getUserLoged().token, category.id).subscribe((data: any) => {
      this.forum_categories.splice(this.forum_categories.findIndex(x => x.id === category.id), 1);
    }, error => {
      console.log(error);
    });
  }

}

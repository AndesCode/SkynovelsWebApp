import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../../services/admin.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  user: any = null;
  searchText;
  current_page = 1;
  user_selected = false;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private _as: AdminService,
              private _us: UsersService,
              private modalService: NgbModal) {
  }

  // Función para abrir modals.
  openSm(content: any) {
    this.modalService.open(content, { size: 'sm' });
  }

  ngOnInit(): void {
    this._as.adminGetUsers('All').subscribe((data: any) => {
      this.users = data.users;
      console.log(this.users);
      if (this.user === null || this.user === undefined) {
        this.route.params.subscribe(params => {
          if (params['id'] !== undefined && params['id'] !== null) {
            this.findUserFromURL(Number(params['id']));
          } else {
            return;
          }
        });
      } else {
        this.findUserFromURL(this.user.id);
      }
    }, error => {

    });
  }

  /*verifyAdminRoleOnToken() {
    if (this._auth.getUserLoged().user_rol === 'admin') {
      this.loadUsersData();
    } else {
      this.router.navigate(['home']);
    }
  }*/


  findUserFromURL(user_id: any) {
    for (let i = 0; i <  this.users.length; i++) {
      if (this.users[i].id === user_id) {
        this.goToEditUser(this.users[i].id);
        break;
      } else {
        if (this.users.length === i + 1) {
          this.backToUserList();
        }
      }
    }
  }

  goToEditUser(user_id: any) {
    this.user = this.users.find(x => x.id === Number(user_id));
    this.location.go('panel/administracion-de-usuarios/' + this.user.id);
    this.user_selected = true;
  }

  backToUserList() {
    this.location.go('/panel/administracion-de-usuarios');
    this.user = null;
    this.user_selected = false;
  }

  save() {
    this._as.adminUpdateUser(this._us.getUserLoged().token, this.user).subscribe(() => {
    }, error => {
      this._as.adminPanelErrorHandler(error);
    });
  }

  swichtUserStatus(status: string) {
    const user = {
      id: this.user.id,
      user_status: status
    };
    this._as.adminUpdateUser(this._us.getUserLoged().token, user).subscribe((data: any) => {
      this.user.user_status = data.user.user_status;
    }, error => {
      this._as.adminPanelErrorHandler(error);
    });
  }

  deleteUser() {
    this._as.adminDeleteUser(this._us.getUserLoged().token, this.user.id).subscribe((data: any) => {
      this.users.splice(this.users.findIndex(user => user.id === data.user.id), 1);
      this.backToUserList();
    }, error => {
      this._as.adminPanelErrorHandler(error);
    });
  }
}

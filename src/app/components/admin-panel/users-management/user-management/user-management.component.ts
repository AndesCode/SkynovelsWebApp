import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../../services/admin.service';
import { UsersService } from '../../../../services/users.service';
import { User } from 'src/app/models/models';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  user: User;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              public dialog: MatDialog,
              public matSnackBar: MatSnackBar,
              private as: AdminService,
              private us: UsersService) {
}

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.as.adminGetUser(this.us.getUserLoged().token, id).subscribe((data: any) => {
      this.user = data.user;
    }, error => {
      this.router.navigate(['']);
    });
  }

  openDialogSheet(template: TemplateRef<any>): void {
    this.dialog.open(template);
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  swichtUserStatus(status: 'Active' | 'Disabled') {
    const user: User = {
      id: this.user.id,
      user_status: status
    };
    this.as.adminUpdateUser(this.us.getUserLoged().token, user).subscribe((data: any) => {
      this.user.user_status = data.user.user_status;
      if (status === 'Active') {
        this.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Usuario activado!';
      } else {
        this.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Usuario desactivado!';
      }
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  save() {
    this.as.adminUpdateUser(this.us.getUserLoged().token, this.user).subscribe(() => {
      this.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Cambios guardados!';
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  deleteUser() {
    this.as.adminDeleteUser(this.us.getUserLoged().token, this.user.id).subscribe((data: any) => {
      this.router.navigate(['panel/administracion-de-usuarios']);
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

}

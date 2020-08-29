import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { User } from 'src/app/models/models';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  public fileToUpload: File = null;
  public imageSelected: string;
  public imagePath;
  public imgURL: any = '../../../assets/img/noimage.jpg';
  currentWindow = 'profile';
  userData: User;
  user: User = null;
  editableProfile = false;
  loading = true;
  edition = false;
  componentName = 'UserProfileComponent';

  constructor(private activatedRoute: ActivatedRoute,
              private us: UsersService,
              private router: Router,
              private location: Location,
              public matSnackBar: MatSnackBar,
              public hs: HelperService) {}

  ngOnInit(): void {
    this.hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'reloadUser') {
        this.getUser();
      }
    });
    const urlId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.us.getUser(urlId).subscribe((data: any) => {
      this.userData = data.user[0];
      this.location.replaceState('/perfil/' + this.userData.id + '/' + this.userData.user_login);
      if (this.userData.user_profile_image && this.userData.user_profile_image.length > 0) {
        this.imgURL = 'http://localhost:3000/api/user-profile-img/' + this.userData.user_profile_image + '/false';
      }
      /*if (data.self_user) {
        this.editableProfile = true;
      }*/
      console.log(data);
      this.loading = false;
      this.getUser();
    }, error => {
      this.router.navigate(['']);
    });
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  updateUser(userForm: NgForm) {
    this.edition = false;
    if (userForm.valid && userForm.dirty) {
      this.us.updateUser(this.userData).subscribe((data: any) => {
        console.log(data);
        userForm.reset(userForm.value);
        this.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Cambios guardados!';
      }, error => {
        this.edition = true;
        this.openMatSnackBar(this.errorSnackRef);
        this.errorSnackMessage = error.error.message;
      });
    } else {
      this.edition = false;
      return;
    }
  }

  getUser() {
    this.user = this.us.getUserLoged();
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files.length > 0) {
      this.fileToUpload = fileInput.target.files[0];
      console.log(this.fileToUpload);
      this.imageSelected = this.fileToUpload.name;
    } else {
      fileInput = null;
      this.imageSelected = '';
    }
    if (fileInput.target.files.length === 0) {
      this.fileToUpload = null;
      return;
    }
    const mimeType =  this.fileToUpload.type;
    console.log(mimeType);
    if (mimeType.match(/image\/*/) == null) {
        this.imageSelected = 'Solo puedes seleccionar imagenes .jpg';
        this.fileToUpload = null;
        return;
    }
    const reader = new FileReader();
    this.imagePath = this.fileToUpload;
    reader.readAsDataURL(this.fileToUpload);
    // tslint:disable-next-line: variable-name
    reader.onload = (_event) => {
    this.imgURL = reader.result;
    };
    this.hs.uploadImage(this.userData.id, this.fileToUpload, this.userData.user_profile_image, 'user').then((img: any) => {
          this.userData.user_profile_image = img.image;
          this.fileToUpload = null;
          this.openMatSnackBar(this.successSnackRef);
          this.successSnackMessage = '¡Cambios guardados!';
          return;
        }).catch(error => {
          console.log(error);
          this.openMatSnackBar(this.errorSnackRef);
          this.errorSnackMessage = error.error.message;
        });
  }

  switchToEdition() {
    if (this.user && this.user.id === this.userData.id) {
      this.edition = true;
    } else {
      return;
    }
  }
}

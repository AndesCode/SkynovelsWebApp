import { Component, OnInit, ViewChild, TemplateRef, isDevMode, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { User } from 'src/app/models/models';
import { NgForm } from '@angular/forms';
import { isPlatformBrowser, Location } from '@angular/common';
import { Dev, Prod } from 'src/app/config/config';
import { PageService } from '../../services/page.service';

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
  public imgURL: any = '../../../assets/img/usernoimage.jpg';
  currentWindow = 'profile';
  userData: User;
  user: User = null;
  loading = true;
  edition = false;
  componentName = 'UserProfileComponent';
  apiURL: string;
  isBrowser: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private us: UsersService,
              private router: Router,
              private location: Location,
              public hs: HelperService,
              public ps: PageService,
              private dev: Dev,
              private prod: Prod,
              @Inject(PLATFORM_ID) private platformId) {
                this.isBrowser = isPlatformBrowser(this.platformId);
                if (isDevMode()) {
                  this.apiURL = this.dev.apiURL
                } else {
                  this.apiURL = this.prod.apiURL
                }
              }

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
      if (this.userData.image && this.userData.image.length > 0) {
        this.imgURL = this.apiURL + '/api/get-image/' + this.userData.image + '/users/false';
        
      }
      this.loading = false;
      this.hs.updateBrowserMeta('description', `${this.userData.user_login}, perfil de usuario`, 'SkyNovels | ' + this.userData.user_login);
      this.getUser();
    }, error => {
      this.router.navigate(['']);
    });
  }

  updateUser(userForm: NgForm) {
    this.edition = false;
    if (userForm.valid && userForm.dirty) {
      this.us.updateUser(this.userData).subscribe((data: any) => {
        userForm.reset(userForm.value);
        this.ps.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Cambios guardados!';
      }, error => {
        this.edition = true;
        this.ps.openMatSnackBar(this.errorSnackRef);
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
    this.hs.uploadImage(this.userData.id, this.fileToUpload, 'user').then((img: any) => {
          this.userData.image = img.image;
          if (img.sknvl_s && this.isBrowser) {
            localStorage.setItem('sknvl_s', img.sknvl_s);
          }
          this.fileToUpload = null;
          this.ps.openMatSnackBar(this.successSnackRef);
          this.successSnackMessage = '¡Cambios guardados!';
          return;
        }).catch(error => {
          this.ps.openMatSnackBar(this.errorSnackRef);
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

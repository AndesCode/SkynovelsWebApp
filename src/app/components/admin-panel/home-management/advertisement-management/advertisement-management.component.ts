import { Component, OnInit, ViewChild, TemplateRef, Inject, PLATFORM_ID, isDevMode } from '@angular/core';
import { UsersService } from '../../../../services/users.service';
import { AdminService } from '../../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Advertisement } from '../../../../models/models';
import { Location, isPlatformBrowser } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Dev, Prod } from 'src/app/config/config';
import { PageService } from '../../../../services/page.service';

@Component({
  selector: 'app-advertisement-management',
  templateUrl: './advertisement-management.component.html',
  styleUrls: ['./advertisement-management.component.scss']
})
export class AdvertisementManagementComponent implements OnInit {

  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  advertisement: Advertisement;

  public fileToUpload: File = null;
  public imageSelected: string;
  public imagePath;
  public imgURL: any  = '../../../../../assets/img/noimage.jpg';
  apiURL: string;
  uploading = false;
  loading = true;

  public Editor;
  public ckEditorConfig;
  isBrowser: boolean;

  constructor(private us: UsersService,
              private as: AdminService,
              public ps: PageService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private dev: Dev,
              private prod: Prod,
              private location: Location,
              @Inject(PLATFORM_ID) private platformId) {

              if (isDevMode()) {
                this.apiURL = this.dev.apiURL
              } else {
                this.apiURL = this.prod.apiURL
              }

              this.isBrowser = isPlatformBrowser(this.platformId);
              if (this.isBrowser) {
                const ClassicEditor = require('@ckeditor/ckeditor5-cutom-build/build/ckeditor.js');
                this.Editor = ClassicEditor;
                this.ckEditorConfig = {
                  toolbar: [
                    'heading', '|',
                    // 'fontfamily', 'fontsize', '|',
                    // 'fontColor', 'fontBackgroundColor', '|',
                    'bold', 'italic', 'link', '|',
                    // 'strikethrough', 'superscript', 'subscript', '|',
                    'outdent', 'indent', '|',
                    'bulletedList', 'numberedList', '|',
                    // 'todoList'
                    'blockQuote', '|',
                    'undo', 'redo', '|',
                    // 'imageUpload'
                ]
                };
              }

  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.as.adminGetAdvertisement(this.us.getUserLoged().token, Number(id)).subscribe((data: any) => {
        this.advertisement = data.advertisement;
        this.location.replaceState('/panel/administracion-de-pagina-de-inicio/noticias/'
         + this.advertisement.id + '/' + this.advertisement.adv_name);
        this.loading = false;
        if (this.advertisement.image && this.advertisement.image.length > 0) {
          this.imgURL = this.apiURL + '/api/get-image/' + this.advertisement.image + '/advertisements/false'
        }
      }, error => {
        this.router.navigate(['panel/administracion-de-pagina-de-inicio']);
      });
    } else {
      this.advertisement = new Advertisement();
      this.advertisement.adv_status = 'Disabled'
      this.location.replaceState('/panel/administracion-de-pagina-de-inicio/noticias/nuevo');
      this.loading = false;
      this.advertisement.adv_content = '';
    }
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
  }

  save(advertisementForm: NgForm) {
    if (this.uploading || advertisementForm.invalid || (!advertisementForm.dirty && !this.fileToUpload)) {
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Formulario invalido';
      return;
    }
    this.uploading = true;
    this.advertisement.adv_title = this.advertisement.adv_title.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
    let request: Observable<any>;
    if ( this.advertisement.id ) {
      request = this.as.adminUpdateAdvertisement(this.us.getUserLoged().token, this.advertisement);
    } else {
      request = this.as.adminCreateAdvertisement(this.us.getUserLoged().token, this.advertisement);
    }
    request.subscribe((resp: any) => {
      this.location.replaceState('/panel/administracion-de-pagina-de-inicio/noticias/'
      + resp.advertisement.id + '/' + resp.advertisement.adv_name);
      if (this.advertisement.id === undefined
        || this.advertisement.id === null) {
          this.advertisement.id = resp.advertisement.id;
          this.advertisement.adv_name = resp.advertisement.adv_name;
      }
      advertisementForm.form.markAsPristine();
      if ( this.fileToUpload ) {
        this.as.AdminUploadImage(this.us.getUserLoged().token, this.advertisement.id, this.fileToUpload)
        .then((img: any) => {
          this.advertisement.image = img.image;
          this.fileToUpload = null;
          this.ps.openMatSnackBar(this.successSnackRef);
          this.successSnackMessage = '¡Cambios guardados!';
          this.uploading = false;
          return;
        }).catch(error => {
          this.ps.openMatSnackBar(this.errorSnackRef);
          this.errorSnackMessage = error.message;
        });
      } else {
        this.uploading = false;
        this.ps.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Cambios guardados!';
      }
    }, error => {
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  deleteAdvertisement() {
    this.uploading = true;
    this.as.adminDeleteAdvertisement(this.us.getUserLoged().token, this.advertisement.id).subscribe((data: any) => {
      this.uploading = false;
      this.ps.dialogCloseAll();
      setTimeout(() => {
        this.router.navigate(['panel/administracion-de-pagina-de-inicio']);
      }, 200); 
    }, error => {
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

}

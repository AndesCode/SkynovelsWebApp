import { Component, OnInit, ViewChild, TemplateRef, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { NovelsService } from '../../../../services/novels.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../../../services/users.service';
import { Novel, Genre, User, Chapter, Volume } from 'src/app/models/models';
import { AdminService } from '../../../../services/admin.service';
import { PageService } from '../../../../services/page.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-novel-management',
  templateUrl: './novel-management.component.html',
  styleUrls: ['./novel-management.component.scss']
})
export class NovelManagementComponent implements OnInit {

  public Editor;
  public ckEditorConfig;
  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  public fileToUpload: File = null;
  public imageSelected: string;
  public imagePath;
  public imgURL: any  = '../../../assets/img/noimage.jpg';
  public message: string;
  novelStatusEditable = false;
  collaborators: Array<User> = [];
  loading = true;
  novel: Novel;
  genres: Array<Genre> = [];
  uploading = false;
  novelPublished = false;
  chapterEdition = false;
  isBrowser: boolean;

    constructor(private activatedRoute: ActivatedRoute,
                public ns: NovelsService,
                public ps: PageService,
                private as: AdminService,
                private us: UsersService,
                public hs: HelperService,
                private router: Router,
                public dialog: MatDialog,
                public matSnackBar: MatSnackBar,
                @Inject(PLATFORM_ID) private platformId) {

                this.isBrowser = isPlatformBrowser(this.platformId);
                if (this.isBrowser) {
                  const ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
                  this.Editor = ClassicEditor;
                  this.ckEditorConfig = {
                    toolbar: [ 'heading', '|', 'bold', 'italic' ]
                  };
                }
    }

  openDialogSheet(template: TemplateRef<any>): void {
    this.dialog.open(template);
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  ngOnInit(): void {
    const nid = this.activatedRoute.snapshot.paramMap.get('id');
    this.ns.getGenres().subscribe((data: any) => {
      this.genres = data.genres;
    });
    this.as.adminGetNovel(this.us.getUserLoged().token, Number(nid)).subscribe((novelData: any) => {
      this.novel = novelData.novel[0];
      this.novel.genres = this.novel.genres.map(genre => genre.id);
      this.collaborators = this.novel.collaborators.slice();
      if (this.novel.nvl_img) {
        this.imgURL = 'http://localhost:3000/api/novel/image/' + this.novel.nvl_img + '/false';
      }
      if (this.novel.nvl_status === 'Active' || this.novel.nvl_status === 'Finished') {
        this.novelPublished = true;
      }
      this.evaluateEditableNovelStatus();
      this.loading = false;
    }, error => {
      this.router.navigate(['mis-novelas']);
    });
  }

  save(novelForm: NgForm) {
    if (this.uploading || novelForm.invalid || (!novelForm.dirty && !this.fileToUpload)) {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Formulario invalido';
      return;
    }
    this.uploading = true;
    this.novel.nvl_title = this.novel.nvl_title.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
    this.novel.collaborators = this.collaborators.map(collaborator => collaborator.user_id);
    this.as.adminUpdateNovel(this.us.getUserLoged().token, this.novel).subscribe((resp: any) => {
      this.novel.nvl_recommended = resp.novel.nvl_recommended;
      if (resp.novel.nvl_status === 'Active' || resp.novel.nvl_status === 'Finished') {
        this.novelPublished = true;
      }
      if (resp.novel.nvl_status === 'Disabled') {
        this.novelPublished = false;
      }
      novelForm.form.markAsPristine();
      if (!this.novelStatusEditable) {
        this.novel.nvl_status = 'Disabled';
      }
      if ( this.fileToUpload ) {
        this.hs.uploadImage(this.novel.id, this.fileToUpload, this.novel.nvl_img, 'novel')
        .then((img: any) => {
          this.novel.nvl_img = img.novel.nvl_img;
          this.fileToUpload = null;
          this.uploading = false;
          this.openMatSnackBar(this.successSnackRef);
          this.successSnackMessage = '¡Cambios guardados!';
          return;
        }).catch(error => {
          this.openMatSnackBar(this.errorSnackRef);
          this.errorSnackMessage = error.error.message;
        });
      } else {
        this.uploading = false;
        this.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Cambios guardados!';
      }
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  setRecommendedNovel() {
    this.as.adminCreateRecommnededNovel(this.us.getUserLoged().token, this.novel.id).subscribe((data: any) => {
      this.novel.nvl_recommended = true;
      this.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Novela recomendada!';
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  deleteCollaborator(collaborator: any) {
    const collaboratorsArray = [];
    for (const collaboratorToPush of this.collaborators) {
        if (collaboratorToPush.user_id !== collaborator.user_id) {
          collaboratorsArray.push(collaboratorToPush.user_id);
        }
    }
    const novel: Novel = {
      id: this.novel.id,
      collaborators: collaboratorsArray
    };
    this.as.adminUpdateNovel(this.us.getUserLoged().token, novel).subscribe((data: any) => {
      this.collaborators.splice(
        this.collaborators.findIndex(deletedCollaborator => deletedCollaborator.user_id === collaborator.user_id), 1
      );
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  deleteNovel() {
    this.uploading = true;
    this.as.adminDeleteNovel(this.us.getUserLoged().token, this.novel.id).subscribe((data: any) => {
      this.uploading = false;
      this.dialog.closeAll();
      this.router.navigate(['']);
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  disableNovel() {
    const disableNovel: Novel = {
      id: this.novel.id,
      nvl_status: 'Disabled'
    };
    this.as.adminUpdateNovel(this.us.getUserLoged().token, disableNovel).subscribe((data: any) => {
      this.novel.nvl_status = data.novel.nvl_status;
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  evaluateEditableNovelStatus() {
    for (const [i, volume] of this.novel.volumes.entries()) {
      const chaptersStatus = volume.chapters.map(
        chapterStatus => chapterStatus.chp_status);
      if (chaptersStatus.includes('Active')) {
        this.novelStatusEditable = true;
        break;
      } else {
        if (i + 1 === this.novel.volumes.length) {
          this.novelStatusEditable = false;
          this.disableNovel();
        }
      }
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

  updateVolume(volume: Volume, editVolumeForm: NgForm) {
    if (editVolumeForm.valid) {
      this.uploading = true;
      this.as.adminUpdateVolume(this.us.getUserLoged().token, volume).subscribe((data: any) => {
        this.dialog.closeAll();
        this.uploading = false;
        this.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Volumen actualizado!';
      }, error => {
        this.openMatSnackBar(this.errorSnackRef);
        this.errorSnackMessage = error.error.message;
        this.uploading = false;
      });
    } else {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Formulario invalido';
    }
  }

  deleteVolume(volume: Volume) {
    this.uploading = true;
    this.as.adminDeleteVolume(this.us.getUserLoged().token, volume.id).subscribe((data: Volume) => {
      this.novel.volumes.splice(this.novel.volumes.findIndex(x => x.id === volume.id), 1);
      this.dialog.closeAll();
      this.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Volumen eliminado!';
      this.uploading = false;
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
      this.uploading = false;
    });
  }

  goToChapterEdition(volume: Volume, chapter?: Chapter) {
    this.router.navigate(['panel/administracion-de-novelas', this.novel.id, volume.id, chapter.id]);
  }
}


import { Component, OnInit, ViewChild, TemplateRef, Inject, PLATFORM_ID, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { NovelsService } from '../../../../services/novels.service';
import { HelperService } from 'src/app/services/helper.service';
import { UsersService } from '../../../../services/users.service';
import { Novel, Genre, User, Chapter, Volume } from 'src/app/models/models';
import { AdminService } from '../../../../services/admin.service';
import { PageService } from '../../../../services/page.service';
import { isPlatformBrowser } from '@angular/common';
import { Dev, Prod } from 'src/app/config/config';

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
  apiURL: string;
  collaboratorForm: FormGroup;

    constructor(private activatedRoute: ActivatedRoute,
                public ns: NovelsService,
                public ps: PageService,
                private as: AdminService,
                private us: UsersService,
                public hs: HelperService,
                private router: Router,
                private dev: Dev,
                private prod: Prod,
                @Inject(PLATFORM_ID) private platformId) {

                  this.collaboratorForm = new FormGroup({
                    user_login: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
                  });

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
    const nid = this.activatedRoute.snapshot.paramMap.get('id');
    this.ns.getGenres().subscribe((data: any) => {
      this.genres = data.genres;
    });
    this.as.adminGetNovel(this.us.getUserLoged().token, Number(nid)).subscribe((novelData: any) => {
      this.novel = novelData.novel[0];
      this.novel.genres = this.novel.genres.map(genre => genre.id);
      this.collaborators = this.novel.collaborators.slice();
      if (this.novel.image) {
        this.imgURL = this.apiURL + '/api/get-image/' + this.novel.image + '/novels/false';
      }
      if (this.novel.nvl_status === 'Active' || this.novel.nvl_status === 'Finished') {
        this.novelPublished = true;
      }
      this.evaluateEditableNovelStatus();
      this.loading = false;
    }, error => {
      this.router.navigate(['panel/administracion-de-novelas']);
    });
  }

  save(novelForm: NgForm) {
    if (this.uploading || novelForm.invalid || (!novelForm.dirty && !this.fileToUpload)) {
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Formulario invalido';
      return;
    }
    this.uploading = true;
    this.novel.nvl_title = this.novel.nvl_title.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
    this.novel.collaborators = this.collaborators.map(collaborator => collaborator.user_id);
    const novel: Novel = {
      id: this.novel.id,
      genres: this.novel.genres,
      collaborators: this.novel.collaborators,
      nvl_acronym: this.novel.nvl_acronym,
      nvl_content: this.novel.nvl_content,
      nvl_status: this.novel.nvl_status,
      nvl_title: this.novel.nvl_title,
      nvl_writer: this.novel.nvl_writer,
      nvl_translator: this.novel.nvl_translator,
      nvl_translator_eng: this.novel.nvl_translator_eng
    };

    this.as.adminUpdateNovel(this.us.getUserLoged().token, novel).subscribe((resp: any) => {
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
        this.hs.uploadImage(this.novel.id, this.fileToUpload, 'novel')
        .then((img: any) => {
          this.novel.image = img.novel.image;
          this.fileToUpload = null;
          this.uploading = false;
          this.ps.openMatSnackBar(this.successSnackRef);
          this.successSnackMessage = '¡Cambios guardados!';
          return;
        }).catch(error => {
          this.ps.openMatSnackBar(this.errorSnackRef);
          this.errorSnackMessage = error.error.message;
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

  setRecommendedNovel() {
    this.as.adminCreateRecommnededNovel(this.us.getUserLoged().token, this.novel.id).subscribe((data: any) => {
      this.novel.nvl_recommended = true;
      this.ps.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Novela recomendada!';
    }, error => {
      this.ps.openMatSnackBar(this.errorSnackRef);
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
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  deleteNovel() {
    this.uploading = true;
    this.as.adminDeleteNovel(this.us.getUserLoged().token, this.novel.id).subscribe((data: any) => {
      this.uploading = false;
      this.ps.dialogCloseAll();
      setTimeout(() => {
        this.router.navigate(['panel/administracion-de-novelas']);
      }, 300); 
    }, error => {
      this.ps.openMatSnackBar(this.errorSnackRef);
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
      this.ps.openMatSnackBar(this.errorSnackRef);
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
        this.ps.dialogCloseAll();
        this.uploading = false;
        this.ps.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Volumen actualizado!';
      }, error => {
        this.ps.openMatSnackBar(this.errorSnackRef);
        this.errorSnackMessage = error.error.message;
        this.uploading = false;
      });
    } else {
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Formulario invalido';
    }
  }

  createNovelCollaborator() {
    this.as.adminCreateNovelCollaborator(this.us.getUserLoged().token, this.collaboratorForm.value.user_login, this.novel.id).subscribe((data: any) => {
      this.ps.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Colaborador añadido!';
      this.collaborators.push(data.collaborator);
      this.ps.dialogCloseAll();
    }, error => {
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  deleteVolume(volume: Volume) {
    this.uploading = true;
    this.as.adminDeleteVolume(this.us.getUserLoged().token, volume.id).subscribe((data: Volume) => {
      this.novel.volumes.splice(this.novel.volumes.findIndex(x => x.id === volume.id), 1);
      this.ps.dialogCloseAll();
      this.ps.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Volumen eliminado!';
      this.uploading = false;
    }, error => {
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
      this.uploading = false;
    });
  }

  goToChapterEdition(volume: Volume, chapter?: Chapter) {
    this.router.navigate(['panel/administracion-de-novelas', this.novel.id, volume.id, chapter.id]);
  }
}


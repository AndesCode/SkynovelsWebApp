import { Component, OnInit, ViewChild, TemplateRef, Inject, PLATFORM_ID, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NovelsService } from '../../services/novels.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location, isPlatformBrowser } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { Novel, Genre, User, Chapter, Volume } from 'src/app/models/models';
import { PageService } from '../../services/page.service';
import { Dev, Prod } from '../../config/config';

@Component({
  selector: 'app-user-novel',
  templateUrl: './user-novel.component.html',
  styleUrls: ['./user-novel.component.scss']
})
export class UserNovelComponent implements OnInit {

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
  editableNovel = false;
  user: number = null;
  genres: Array<Genre> = [];
  uploading = false;
  chapterEdition = false;
  collaboratorForm: FormGroup;
  volumeForm: FormGroup;
  isBrowser: boolean;
  componentName = 'UserNovelComponent';
  apiURL: string;

    constructor( private activatedRoute: ActivatedRoute,
                 public ns: NovelsService,
                 private us: UsersService,
                 public hs: HelperService,
                 public ps: PageService,
                 private router: Router,
                 public dialog: MatDialog,
                 public matSnackBar: MatSnackBar,
                 private location: Location,
                 private dev: Dev,
                 private prod: Prod,
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
                      // toolbar: [ 'heading', '|', 'bold', 'italic', '|' , '|', 'fontColor', 'fontBackgroundColor']
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
                  this.collaboratorForm = new FormGroup({
                    user_login: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
                  });

                  this.volumeForm = new FormGroup({
                    vlm_title: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(125)]),
                  });

    }
  openDialogSheet(template: TemplateRef<any>): void {
    this.dialog.open(template);
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  ngOnInit(): void {
    const nid = this.activatedRoute.snapshot.paramMap.get('nid');
    this.ns.getGenres().subscribe((data: any) => {
      this.genres = data.genres;
    });
    if (nid !== 'nuevo') {
      this.ns.getNovel(Number(nid), 'edition').subscribe((novelData: any) => {
        if (novelData.authorized_user) {
          this.user = novelData.authorized_user;
          this.novel = novelData.novel[0];
          this.hs.updateBrowserMeta('description', this.novel.nvl_content, this.novel.nvl_title);
          this.location.replaceState('/mis-novelas/' + this.novel.id + '/' + this.novel.nvl_name);
          this.novel.genres = this.novel.genres.map(genre => genre.id);
          this.collaborators = this.novel.collaborators.slice();
          if (this.user === this.novel.nvl_author) {
            this.editableNovel = true;
          }
          if (this.novel.image && this.novel.image.length > 0) {
            this.imgURL = this.apiURL + '/api/get-image/' + this.novel.image + '/novels/false';
          }
          this.evaluateEditableNovelStatus();
        } else {
          this.router.navigate(['mis-novelas']);
        }
        this.loading = false;
      }, error => {
        this.router.navigate(['mis-novelas']);
      });
    } else {
      this.novel = new Novel();
      this.editableNovel = true;
      this.novel.nvl_status = 'Disabled';
      this.novel.nvl_content = '';
      this.loading = false;
      this.location.replaceState('/mis-novelas/nuevo');
    }
  }

  save(novelForm: NgForm) {
    if (this.uploading || novelForm.invalid || (!novelForm.dirty && !this.fileToUpload)) {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Formulario invalido';
      return;
    }
    this.uploading = true;
    this.novel.nvl_title = this.novel.nvl_title.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
    let request: Observable<any>;
    this.novel.collaborators = this.collaborators.map(collaborator => collaborator.user_id);
    if (!this.novelStatusEditable) {
      this.novel.nvl_status = 'Disabled';
    }
    if ( this.novel.id ) {

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

      request = this.ns.updateNovel(novel);
    } else {
      request = this.ns.createNovel(this.novel);
    }
    request.subscribe((resp: any) => {
      this.location.replaceState('/mis-novelas/' + resp.novel.id + '/' + resp.novel.nvl_name);
      if (this.novel.id === undefined
        || this.novel.id === null) {
          this.novel.id = resp.novel.id;
          this.novel.nvl_name = resp.novel.nvl_name;
          this.novel.volumes = [];
          this.novel.collaborators = [];
      }
      novelForm.form.markAsPristine();
      if ( this.fileToUpload ) {
        this.hs.uploadImage(this.novel.id, this.fileToUpload, 'novel').then((img: any) => {
          this.novel.image = img.image;
          this.fileToUpload = null;
          this.uploading = false;
          this.openMatSnackBar(this.successSnackRef);
          this.successSnackMessage = '¡Cambios guardados!';
          return;
        }).catch(error => {
          this.openMatSnackBar(this.errorSnackRef);
          this.errorSnackMessage = error.message;
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
    this.ns.updateNovel(novel).subscribe((data: any) => {
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
    if (this.editableNovel && this.novel.id) {
      this.ns.deleteNovel(this.novel.id).subscribe((data: any) => {
        this.uploading = false;
        this.dialog.closeAll();
        this.router.navigate(['mis-novelas']);
      });
    } else {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'No autorizado';
      return;
    }
  }

  disableNovel() {
    const disableNovel: Novel = {
      id: this.novel.id,
      nvl_status: 'Disabled'
    };
    this.ns.updateNovel(disableNovel).subscribe((data: any) => {
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

  createUserInvitation() {
    this.us.sendInvitation(this.collaboratorForm.value.user_login, this.novel.id).subscribe((data: any) => {
      this.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Invitación enviada!';
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  createVolume() {
    if (this.volumeForm.valid) {
      this.uploading = true;
      this.ns.createNovelVolume(this.volumeForm.value.vlm_title, this.novel.id).subscribe((data: any) => {
        this.novel.volumes.push(data.volume);
        this.dialog.closeAll();
        this.volumeForm.reset();
        this.uploading = false;
        this.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Volumen creado!';
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

  updateVolume(volume: Volume, editVolumeForm: NgForm) {
    if (editVolumeForm.valid) {
      this.uploading = true;
      this.ns.updateNovelVolume(volume).subscribe((data: any) => {
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
    this.ns.deleteNovelVolume(volume.id).subscribe((data: Volume) => {
      this.novel.volumes.splice(this.novel.volumes.findIndex(x => x.id === volume.id), 1);
      this.dialog.closeAll();
      this.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Volumen eliminado!';
      this.uploading = false;
      this.evaluateEditableNovelStatus();
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
      this.uploading = false;
    });
  }

  goToChapterEdition(newChapter: boolean, volume: Volume, chapter?: Chapter) {
    if (newChapter) {
      this.router.navigate(['mis-novelas', this.novel.id, this.novel.nvl_name, volume.id, 'nuevo']);
    } else {
      this.router.navigate(['mis-novelas', this.novel.id, this.novel.nvl_name, volume.id, chapter.id, chapter.chp_name]);
    }
  }
}


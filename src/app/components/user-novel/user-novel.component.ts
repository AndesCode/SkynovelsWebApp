import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NovelsService } from '../../services/novels.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { Volume } from 'src/app/models/volume';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { User } from 'src/app/models/user';
import { Novel, Genre } from 'src/app/models/models';
import { Chapter } from 'src/app/models/chapter';






@Component({
  selector: 'app-user-novel',
  templateUrl: './user-novel.component.html',
  styleUrls: ['./user-novel.component.scss']
})
export class UserNovelComponent implements OnInit {



  public Editor = ClassicEditor;
  public ckEditorConfig = {
    toolbar: [ 'heading', '|', 'bold', 'italic' ]
  };
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
  panelOpenState = false;
  user: number = null;
  genres: Array<Genre> = [];
  uploading = false;
  chapterEdition = false;
  collaboratorForm: FormGroup;
  volumeForm: FormGroup;

    constructor( private activatedRoute: ActivatedRoute,
                 public ns: NovelsService,
                 private us: UsersService,
                 public hs: HelperService,
                 private router: Router,
                 public dialog: MatDialog,
                 public matSnackBar: MatSnackBar,
                 private location: Location) {

                  this.collaboratorForm = new FormGroup({
                    user_login: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
                  });

                  this.volumeForm = new FormGroup({
                    vlm_title: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(65)]),
                  });

    }

  // modal service.
  openDialogSheet(template: TemplateRef<any>): void {
    this.dialog.open(template);
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  ngOnInit(): void {
    const nid = this.activatedRoute.snapshot.paramMap.get('nid');
    console.log(nid);
    // cargamos los generos existentes en Skynovels
    this.ns.getGenres().subscribe((data: any) => {
      this.genres = data.genres;
     /* for (const genre of this.genres) {
        // agregamos a cada genero un atributo check inicializado en falso que controlara el estado del checkbox
        genre.selected = false;
      }*/
    });
    if (nid !== 'nuevo') {
      this.ns.getNovel(Number(nid), 'edition').subscribe((novelData: any) => {
        if (novelData.authorized_user) {
          this.user = novelData.authorized_user;
          console.log(this.user);
          this.novel = novelData.novel[0];
          this.location.replaceState('/mis-novelas/' + this.novel.id + '/' + this.novel.nvl_name);
          this.novel.genres = this.novel.genres.map(genre => genre.id);
          this.collaborators = this.novel.collaborators.slice();
          console.log(this.novel);
          if (this.user === this.novel.nvl_author) {
            this.editableNovel = true;
          }
          if (this.novel.nvl_img) {
            this.imgURL = 'http://localhost:3000/api/novel/image/' + this.novel.nvl_img + '/false';
          }


        } else {
          console.log('no autorizado');
          this.router.navigate(['mis-novelas']);
        }
        this.loading = false;
      }, error => {
        console.log('no autorizado');
        console.log(error);
        this.router.navigate(['mis-novelas']);
      });
    } else {
      this.novel = new Novel();
      this.editableNovel = true;
      this.novel.nvl_status = 'Disabled';
      this.loading = false;
      this.location.replaceState('/mis-novelas/nuevo');
    }
  }



  save(novelForm: NgForm) {
    if (this.uploading || novelForm.invalid || (!novelForm.dirty && !this.fileToUpload)) {
      console.log(this.uploading);
      console.log(novelForm.invalid);
      console.log(novelForm.dirty);
      console.log(this.fileToUpload);
      console.log(this.novel);
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Formulario invalido';
      return;
    }
    this.uploading = true;
    this.novel.nvl_title = this.novel.nvl_title.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
    let request: Observable<any>;
    this.novel.collaborators = this.collaborators.map(collaborator => collaborator.user_id);
    if ( this.novel.id ) {
      request = this.ns.updateNovel(this.novel);
    } else {
      console.log('creando novela...');
      request = this.ns.createNovel(this.novel);
    }
    request.subscribe((resp: any) => {
      console.log(resp);
      this.location.replaceState('/mis-novelas/' + resp.novel.id + '/' + resp.novel.nvl_name);
      if (this.novel.id === undefined
        || this.novel.id === null) {
          this.novel.id = resp.novel.id;
          this.novel.nvl_name = resp.novel.nvl_name;
          this.novel.volumes = [];
          this.novel.collaborators = [];
      }
      novelForm.form.markAsPristine();
      console.log(novelForm.value);
      console.log(this.novel);
      if (!this.novelStatusEditable) {
        this.novel.nvl_status = 'Disabled';
      }

      if ( this.fileToUpload ) {
        console.log('Hay archivo a subir, se ejecuta consulta al servidor');
        this.hs.uploadImage(this.novel.id, this.fileToUpload, this.novel.nvl_img, 'novel')
        .then((img: any) => {
          this.novel.nvl_img = img.novel.nvl_img;
          console.log(img);
          this.fileToUpload = null;
          this.uploading = false;
          this.openMatSnackBar(this.successSnackRef);
          this.successSnackMessage = '¡Cambios guardados!';
          return;
        }).catch(error => {
          console.log(error);
          this.openMatSnackBar(this.errorSnackRef);
          this.errorSnackMessage = error.message;
        });
      } else {
        this.uploading = false;
        this.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Cambios guardados!';
      }
    }, error => {
      console.log(error);
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.message;
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

  /*evaluateEditableNovelStatus() {
    const chapter_status = this.novel.chapters.map(
      chapterStatus => chapterStatus.chp_status);
    if (chapter_status.includes('Publicado')) {
      this.novelStatusEditable = true;
    } else {
      this.hideNovelFormPublic();
    }
  }*/

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
    reader.onload = (_event) => {
    this.imgURL = reader.result;
    };
  }

  createUserInvitation() {
    this.us.sendInvitation(this.collaboratorForm.value.user_login, this.novel.id).subscribe((data: any) => {
      console.log(data.invitation);
      this.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Invitación enviada!';
    }, error => {
      console.log(error);
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  deleteCollaborator(collaborator: any) {
    this.collaborators.splice(this.collaborators.findIndex(deletedCollaborator => deletedCollaborator.id === collaborator.id), 1);
  }

  createVolume() {
    console.log(this.volumeForm.value);
    if (this.volumeForm.valid) {
      this.uploading = true;
      this.ns.createNovelVolume(this.volumeForm.value.vlm_title, this.novel.id).subscribe((data: any) => {
        console.log(data);
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
        console.log(data);
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


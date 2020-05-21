import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { NovelsService } from '../../../../services/novels.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../../../services/users.service';
import { Volume } from 'src/app/models/volume';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Novel, Genre, User } from 'src/app/models/models';
import { Chapter } from 'src/app/models/chapter';
import { AdminService } from '../../../../services/admin.service';


@Component({
  selector: 'app-novel-management',
  templateUrl: './novel-management.component.html',
  styleUrls: ['./novel-management.component.scss']
})
export class NovelManagementComponent implements OnInit {

  panelOpenState = false;
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
  genres: Array<Genre> = [];
  uploading = false;
  chapterEdition = false;

    constructor( private activatedRoute: ActivatedRoute,
                 public ns: NovelsService,
                 private as: AdminService,
                 private us: UsersService,
                 public hs: HelperService,
                 private router: Router,
                 public dialog: MatDialog,
                 public matSnackBar: MatSnackBar) {}

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
      console.log(this.novel);
      if (this.novel.nvl_img) {
        this.imgURL = 'http://localhost:3000/api/novel/image/' + this.novel.nvl_img + '/false';
      }
      this.loading = false;
    }, error => {
      console.log('no autorizado');
      console.log(error);
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
      console.log(resp);
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
          this.errorSnackMessage = error.error.message;
        });
      } else {
        this.uploading = false;
        this.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Cambios guardados!';
      }
    }, error => {
      console.log(error);
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
    // tslint:disable-next-line: variable-name
    reader.onload = (_event) => {
    this.imgURL = reader.result;
    };
  }

  updateVolume(volume: Volume, editVolumeForm: NgForm) {
    if (editVolumeForm.valid) {
      this.uploading = true;
      this.as.adminUpdateVolume(this.us.getUserLoged().token, volume).subscribe((data: any) => {
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

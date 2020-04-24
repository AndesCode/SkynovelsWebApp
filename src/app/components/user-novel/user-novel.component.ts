import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Novel } from 'src/app/models/novel';
import { ChapterModel } from 'src/app/models/chapter';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NovelsService } from '../../services/novels.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';






@Component({
  selector: 'app-user-novel',
  templateUrl: './user-novel.component.html',
  styleUrls: ['./user-novel.component.scss']
})
export class UserNovelComponent implements OnInit {



  inviteUserName: any = {
    user_login: ''
  };
  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  // declaraciones
  public fileToUpload: File = null;
  public image_selected: string;
  public imagePath;
  public imgURL: any  = '../../../assets/img/noimage.jpg';
  public message: string;
  // Novela
  novelStatusEditable = false;
  // Invitaciones
  invitation_error = null;
  invitation_message = null;
  // Colaboradores
  collaborators: any[] = [];
  // Configuración de paginación
  // Alertas y loading
  AlertMessage = null;
  alertStatus = null;
  loading = true;


  // Probando nuevo modelo
  novel: Novel;
  volumes: any = [];
  editableNovel = false;
  panelOpenState = false;
  user: any;
  genres: any = []; // Generos existentes en Skynovels
  uploading = false;
  chapter: ChapterModel = new ChapterModel();
  chapterEdition = false;
  novelForm: FormGroup;


    constructor( private activatedRoute: ActivatedRoute,
                 public ns: NovelsService,
                 public hs: HelperService,
                 private router: Router,
                 public dialog: MatDialog,
                 public matSnackBar: MatSnackBar,
                 private location: Location) {
                    this.novelForm = new FormGroup({
                      nvl_title: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
                      nvl_writer: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
                      genres: new FormControl('', Validators.required),
                      nvl_status: new FormControl('Disabled', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
                      nvl_acronym: new FormControl('', [Validators.maxLength(8)]),
                      nvl_translator: new FormControl('', [Validators.minLength(2), Validators.maxLength(25)]),
                      nvl_translator_eng: new FormControl('', [Validators.minLength(2), Validators.maxLength(25)]),
                      nvl_content: new FormControl('', [Validators.required, Validators.minLength(15), Validators.maxLength(1500)]),
                    });

    }

  // modal service.
  openDialogSheet(template: TemplateRef<any>): void {
    this.dialog.open(template);
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 1000, verticalPosition: 'top'});
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(id);
    // cargamos los generos existentes en Skynovels
    this.ns.getGenres().subscribe((data: any) => {
      this.genres = data.genres;
      for (const genre of this.genres) {
        // agregamos a cada genero un atributo check inicializado en falso que controlara el estado del checkbox
        genre.selected = false;
      }
    });
    if (id !== 'nuevo') {
      this.ns.getNovel(Number(id), 'edition').subscribe((novelData: any) => {
        if (novelData.authorized_user) {
          this.user = novelData.authorized_user;
          this.novel = novelData.novel[0];
          this.novel.genres = this.novel.genres.map(genre => genre.id);
          // this.novel.chapters = novelData.chapters;
          console.log(this.novel);
          if (this.user === this.novel.nvl_author) {
            this.editableNovel = true;
            console.log(this.novel.collaborators);
            this.collaborators = this.novel.collaborators.slice();
          }
          // comprobamos si la novela tiene una imagen asignada, en caso contrario ponemos la imagen por defecto.
          if (this.novel.nvl_img) {
            this.imgURL = 'http://localhost:3000/api/novel/image/' + this.novel.nvl_img + '/false';
          }


        } else {
          console.log('no autorizado');
          this.router.navigate(['mis-novelas']);
        }
        // Fill actual existing novel
        this.novelForm.setValue({
          nvl_title: this.novel.nvl_title,
          nvl_writer: this.novel.nvl_writer,
          genres: this.novel.genres,
          nvl_status: this.novel.nvl_status,
          nvl_acronym: this.novel.nvl_acronym,
          nvl_translator: this.novel.nvl_translator,
          nvl_translator_eng: this.novel.nvl_translator_eng,
          nvl_content: this.novel.nvl_content
        });
      }, error => {
        console.log('no autorizado');
        console.log(error);
        this.router.navigate(['mis-novelas']);
      });
    } else {
      this.editableNovel = true;
      this.novel.nvl_status = 'Disabled';
    }
  }



  save() {
    if ( this.novelForm.invalid ) {
      console.log('Formulario no válido');
      return;
    }
    // this.uploading = true;
    this.novel.nvl_title = this.novel.nvl_title.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
    let request: Observable<any>;
    this.novel.collaborators = this.collaborators.map(collaborator => collaborator.id);
    console.log(this.novelForm.valid);
    console.log(this.novel);
    if ( this.novel.id ) {
      request = this.ns.updateNovel(this.novel);
    } else {
      request = this.ns.createNovel(this.novel);
    }
    request.subscribe( resp => {
      console.log(resp);
      this.location.go('/mi-novela/' + resp.novel.id);
      if (this.novel.id === ''
        || this.novel.id === undefined
        || this.novel.id === null) {
          this.novel.id = resp.novel.id;
          this.novel.nvl_name = resp.novel.nvl_name;
          this.novel.volumes = [];
          this.novel.collaborators = [];
      }
      this.novelForm.reset(this.novelForm.value);
      if (!this.novelStatusEditable) {
        console.log('hago algo');
        this.novel.nvl_status = 'Disabled';
      }

      if ( this.fileToUpload ) {
        console.log('Hay archivo a subir, se ejecuta consulta al servidor');
        this.hs.uploadImage(this.novel.id,
        this.fileToUpload,
        this.novel.nvl_img,
        'novel')
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
        this.successSnackMessage = '¡Cambios guardados!';
      }
    }, error => {
      console.log(error);
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.message;
    });
  }

  deleteNovel() {
    if (this.editableNovel && this.novel.id) {
      this.ns.deleteNovel(this.novel.id).subscribe((data: any) => {
        this.router.navigate(['mis-novelas']);
      });
    } else {
      console.log('No autorizado a eliminar la novela');
      return;
    }
  }

  /*saveChapter(chaperForm: NgForm) {
    if ( form.invalid ) {
      console.log('Formulario no válido');
      return;
    }
    // this.uploading = true;
    console.log(chaperForm);
    let request: Observable<any>;
    if ( this.chapter.id !== '' ) {
      request = this.ns.updateChapter(this.chapter);
    } else {
      request = this.ns.createChapter(this.chapter);
    }
    request.subscribe( resp => {
      console.log(resp);
      this.location.go('/mi-novela/' + this.novel.nvl_name + '/editar-capitulo/' + resp.chapter.id);
      this.chapterFormRef.reset(this.chapterFormRef.value);
      this.chapter.chp_title = resp.chapter.chp_title;
      if (this.chapter.id === ''
        || this.chapter.id === undefined
        || this.chapter.id === null) {
          this.chapter.id = resp.chapter.id;
          this.chapter.chp_author = resp.chapter.chp_author;
          this.novel.chapters.push(this.chapter);
      }
      //this.evaluateEditableNovelStatus();
      // this.refreshChapterList();
      // this.uploading = false;
    }, error => {
      console.log(error);
    });
  }*/

  /*evaluateEditableNovelStatus() {
    const chapter_status = this.novel.chapters.map(
      chapterStatus => chapterStatus.chp_status);
    if (chapter_status.includes('Publicado')) {
      this.novelStatusEditable = true;
    } else {
      this.hideNovelFormPublic();
    }
  }*/

  /*deleteChapter() {
      this.ns.deleteChapter(this.chapter.id).subscribe((data: any) => {
        this.novel.chapters.splice(this.novel.chapters.findIndex(chapter => chapter.id === data.chapter.id), 1);
        this.goToNovelEdition(true);
      }, error => {
        console.log(error);
        // this.uploading = false;
      });
  }*/

  /*goToNovelEdition(confirmed: boolean) {
    if ((this.chapterFormRef.dirty) && !confirmed) {
      this.openSm(this.unsavedChapterModalRef);
    } else {
      this.chapterFormRef.reset(this.chapterFormRef.value);
      this.chapterEdition = false;
      this.location.go('/mi-novela/' + this.novel.nvl_name);
      return;
    }
  }*/

  /*goToChapterEdition(chapter_id: any) {
    if (chapter_id !== 'nuevo') {
      this.chapter = this.novel.chapters.find(x => x.id === Number(chapter_id));
      if (this.chapter) {
        console.log(this.chapter);
        this.chapterEdition = true;
        this.location.go('/mi-novela/' + this.novel.nvl_name + '/editar-capitulo/' + this.chapter.id);
      } else {
        console.log ('cap no valido');
        this.location.go('/mi-novela/' + this.novel.nvl_name);
        console.log(this.chapter);
      }
    } else {
      this.chapter = {
        id: '',
        nvl_id: this.novel.id,
        chp_number: this.novel.chapters.length + 1,
        chp_author: '',
        chp_title: '',
        chp_content: '',
        chp_review: '',
        chp_status: 'Oculto'
      };
      this.location.go('/mi-novela/' + this.novel.nvl_name + '/editar-capitulo/nuevo');
      this.chapterEdition = true;
    }
  }*/

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files.length > 0) {
      this.fileToUpload = fileInput.target.files[0];
      console.log(this.fileToUpload);
      this.image_selected = this.fileToUpload.name;
    } else {
      fileInput = null;
      this.image_selected = '';
    }
    if (fileInput.target.files.length === 0) {
      this.fileToUpload = null;
      return;
    }
    const mimeType =  this.fileToUpload.type;
    console.log(mimeType);
    if (mimeType.match(/image\/*/) == null) {
        this.image_selected = 'Solo puedes seleccionar imagenes .jpg';
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

  sendUserInvitation(user: any) {
    const invitation = {
      invitation_to_id: user.id,
      invitation_novel: this.novel.id
    };
    this.ns.sendInvitation(invitation).subscribe((data: any) => {
      console.log(data.invitation);
      this.invitation_message = '¡Invitación enviada!';
    }, error => {
      this.invitation_error = error.error.message;
    });
  }

  cleanInvitationForm() {
    this.invitation_message = null;
    this.invitation_error = null;
    this.inviteUserName = {
      user_login: ''
    };
  }

  deleteCollaborator(collaborator: any) {
    this.collaborators.splice(this.collaborators.findIndex(deletedCollaborator => deletedCollaborator.id === collaborator.id), 1);
  }

  hideNovelFormPublic() {
    console.log('Ocultando novela');
    const novelStatus: Novel = {
      id: this.novel.id,
      nvl_status: 'Disabled'
    };
    this.ns.updateNovel(novelStatus).subscribe((data: any) => {
      this.novel.nvl_status = 'Disabled';
      this.novelStatusEditable = false;
    });
  }

  /*goBackToMyNovels(confirmed: boolean) {
    if ((this.novelFormRef.dirty || this.genreFormRef.dirty || this.fileToUpload) && !confirmed) {
      this.openSm(this.unsavedNovelModalRef);
    } else {
      this.router.navigate(['mis-novelas']);
      return;
    }
  }*/
}


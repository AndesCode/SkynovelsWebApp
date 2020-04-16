import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NovelModel } from 'src/app/models/novel';
import { AuthService } from '../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChapterModel } from 'src/app/models/chapter';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { NovelsService } from '../../services/novels.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-user-novel',
  templateUrl: './user-novel.component.html',
  styleUrls: ['./user-novel.component.scss']
})
export class UserNovelComponent implements OnInit {

  inviteUserName: any = {
    user_login: ''
  };


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
  p = 1;
  // Configuración de paginación
  date_data: any;
  // Alertas y loading
  AlertMessage = null;
  alertStatus = null;
  loading = true;


  // Probando nuevo modelo
  novel: NovelModel = new NovelModel();
  editable_novel = false;
  user: any;
  genres: any = []; // Generos existentes en Skynovels
  uploading = false;
  chapter: ChapterModel = new ChapterModel();
  chapterEdition = false;
  current_page = 1;
  @ViewChild('novelForm') novelFormRef;
  @ViewChild('genreForm') genreFormRef;
  @ViewChild('unsavedNovelModal') unsavedNovelModalRef;
  @ViewChild('chapterForm') chapterFormRef;
  @ViewChild('unsavedChapterModal') unsavedChapterModalRef;

    constructor( private activatedRoute: ActivatedRoute,
                public _ns: NovelsService,
                public _hs: HelperService,
                private router: Router,
                private location: Location,
                private modalService: NgbModal) {}

  // modal service.
  openSm(content: any) {
    this.modalService.open(content, { size: 'sm' });
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(id);
    const chp = this.activatedRoute.snapshot.paramMap.get('chp');
    console.log(chp);
    // cargamos los generos existentes en Skynovels
    this._ns.getGenres().subscribe((genres: any) => {
      this.genres = genres.genres;
    });
    if (id !== 'nuevo') {
      this._ns.getNovel(Number(id), 'edition').subscribe((novelData: any) => {
        if (novelData.authorized_user) {
          this.user = novelData.authorized_user;
          this.novel = novelData.novel;
          this.novel.chapters = novelData.chapters;
          console.log(this.novel);
          if (this.user === this.novel.nvl_author) {
            this.editable_novel = true;
            console.log(this.novel.collaborators);
            this.collaborators = this.novel.collaborators.slice();
            for (let i = 0; i < this.genres.length; i++) {
              // agregamos a cada genero un atributo check inicializado en falso que controlara el estado del checkbox
              this.genres[i].check = false;
            }
            for (let i = 0; i < this.novel.genres.length; i++) {
              for (let j = 0; j < this.genres.length; j++) {
                /* comparamos la lista de generos con la lista de generos asignados en la novela,
                si sus IDs coinciden, el atributo check pasa a true y se chequea
                  el genero */
                if (this.novel.genres[i].id === this.genres[j].id) {
                  this.genres[j].check = true;
                }
              }
            }
          }
          if (this.novel.chapters.length > 0) {
            this.novel.chapters.sort(this._hs.chpNumberSorter);
          }
          this.evaluateEditableNovelStatus();
          // comprobamos si la novela tiene una imagen asignada, en caso contrario ponemos la imagen por defecto.
          if (this.novel.nvl_img !== '') {
            this.imgURL = 'http://localhost:3000/api/novel/image/' + this.novel.nvl_img + '/false';
          }
          if (chp) {
            this.goToChapterEdition(chp);
          } else {
            console.log('no hay capitulo seleccionado');
          }

        } else {
          console.log('no autorizado');
          this.router.navigate(['mis-novelas']);
        }
      }, error => {
        console.log('no autorizado');
        console.log(error);
        this.router.navigate(['mis-novelas']);
      });
    } else {
      this.editable_novel = true;
      this.novel.nvl_status = 'Oculta';
    }
  }

  save(novelForm: NgForm, genreForm: NgForm) {
    /*if ( form.invalid ) {
      console.log('Formulario no válido');
      return;
    }*/
    // this.uploading = true;
    this.novel.nvl_title = this.novel.nvl_title.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
    let request: Observable<any>;
    this.novel.genres = [];
    this.novel.collaborators = this.collaborators.map(collaborator => collaborator.id);
    for (let i = 0; i < this.genres.length; i++) {
      if (this.genres[i].check === true) {
        this.novel.genres.push(this.genres[i].id);
      }
    }
    console.log(this.novel);
    if ( this.novel.id ) {
      request = this._ns.updateNovel(this.novel);
    } else {
      request = this._ns.createNovel(this.novel);
    }
    request.subscribe( resp => {
      console.log(resp);
      this.location.go('/mi-novela/' + resp.novel.id);
      if (this.novel.id === ''
        || this.novel.id === undefined
        || this.novel.id === null) {
          this.novel.id = resp.novel.id;
          this.novel.nvl_name = resp.novel.nvl_name;
          this.novel.chapters = [];
          this.novel.collaborators = [];
      }
      novelForm.reset(novelForm.value);
      if (!this.novelStatusEditable) {
        console.log('hago algo');
        this.novel.nvl_status = 'Oculta';
      }

      if ( this.fileToUpload ) {
        console.log('Hay archivo a subir, se ejecuta consulta al servidor');
        this._hs.uploadImage(this.novel.id,
        this.fileToUpload,
        this.novel.nvl_img,
        'novel')
        .then((img: any) => {
          this.novel.nvl_img = img.novel.nvl_img;
          console.log(img);
          this.fileToUpload = null;
          this.uploading = false;
          return;
        }).catch(error => {
          console.log(error);
        });
      } else {
        this.uploading = false;
      }
    }, error => {
      console.log(error);
    });
  }

  deleteNovel() {
    if (this.editable_novel && this.novel.id) {
      this._ns.deleteNovel(this.novel.id).subscribe((data: any) => {
        this.router.navigate(['mis-novelas']);
      });
    } else {
      console.log('No autorizado a eliminar la novela');
      return;
    }
  }

  saveChapter(chaperForm: NgForm) {
    /*if ( form.invalid ) {
      console.log('Formulario no válido');
      return;
    }*/
    // this.uploading = true;
    console.log(chaperForm);
    let request: Observable<any>;
    if ( this.chapter.id !== '' ) {
      request = this._ns.updateChapter(this.chapter);
    } else {
      request = this._ns.createChapter(this.chapter);
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
      this.evaluateEditableNovelStatus();
      // this.refreshChapterList();
      // this.uploading = false;
    }, error => {
      console.log(error);
    });
  }

  evaluateEditableNovelStatus() {
    const chapter_status = this.novel.chapters.map(
      chapterStatus => chapterStatus.chp_status);
    if (chapter_status.includes('Publicado')) {
      this.novelStatusEditable = true;
    } else {
      this.hideNovelFormPublic();
    }
  }

  deleteChapter() {
      this._ns.deleteChapter(this.chapter.id).subscribe((data: any) => {
        this.novel.chapters.splice(this.novel.chapters.findIndex(chapter => chapter.id === data.chapter.id), 1);
        this.goToNovelEdition(true);
      }, error => {
        console.log(error);
        // this.uploading = false;
      });
  }

  goToNovelEdition(confirmed: boolean) {
    if ((this.chapterFormRef.dirty) && !confirmed) {
      this.openSm(this.unsavedChapterModalRef);
    } else {
      this.chapterFormRef.reset(this.chapterFormRef.value);
      this.chapterEdition = false;
      this.location.go('/mi-novela/' + this.novel.nvl_name);
      return;
    }
  }

  goToChapterEdition(chapter_id: any) {
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
  }

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
    this._ns.sendInvitation(invitation).subscribe((data: any) => {
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
    this.collaborators.splice(this.collaborators.findIndex(deleted_collaborator => deleted_collaborator.id === collaborator.id), 1);
  }

  hideNovelFormPublic() {
    console.log('Ocultando novela');
    const novel_update = {
      id: this.novel.id,
      nvl_status: 'Oculta'
    };
    this._ns.updateNovel(novel_update).subscribe((data: any) => {
      this.novel.nvl_status = 'Oculta';
      this.novelStatusEditable = false;
    });
  }

  goBackToMyNovels(confirmed: boolean) {
    if ((this.novelFormRef.dirty || this.genreFormRef.dirty || this.fileToUpload) && !confirmed) {
      this.openSm(this.unsavedNovelModalRef);
    } else {
      this.router.navigate(['mis-novelas']);
      return;
    }
  }
}


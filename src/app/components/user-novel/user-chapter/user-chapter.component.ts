import { Component, OnInit, ViewChild, TemplateRef, Inject, PLATFORM_ID } from '@angular/core';
import { NovelsService } from '../../../services/novels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Novel, Chapter, Volume } from 'src/app/models/models';
import { Location, isPlatformBrowser } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { HelperService } from '../../../services/helper.service';
import { PageService } from '../../../services/page.service';

@Component({
  selector: 'app-user-chapter',
  templateUrl: './user-chapter.component.html',
  styleUrls: ['./user-chapter.component.scss']
})
export class UserChapterComponent implements OnInit {

  public Editor;
  public ckEditorConfig;
  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  @ViewChild('confirmExitComponentModal') confirmExitComponentModalref: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  user: number = null;
  novel: Novel;
  volume: Volume;
  chapter: Chapter;
  loading = true;
  editableChapter = false;
  uploading = false;
  isBrowser: boolean;
  componentName = 'UserChapterComponent';

  constructor(private ns: NovelsService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private router: Router,
              public ps: PageService,
              private hs: HelperService,
              @Inject(PLATFORM_ID) private platformId) {

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
    const nid = Number(this.activatedRoute.snapshot.paramMap.get('nid'));
    const vid = Number(this.activatedRoute.snapshot.paramMap.get('vid'));
    const cid = this.activatedRoute.snapshot.paramMap.get('cid');
    this.ns.getNovel(nid, 'edition').subscribe((novelData: any) => {
      if (novelData.authorized_user) {
        this.user = novelData.authorized_user;
        this.novel = novelData.novel[0];
        if (this.novel.volumes.findIndex(x => x.id === vid) !== -1) {
          this.volume = this.novel.volumes[this.novel.volumes.findIndex(x => x.id === vid)];
          if (cid !== 'nuevo') {
            if (this.volume.chapters.findIndex(x => x.id === Number(cid)) !== -1) {
              this.ns.getNovelChapterEdition(this.volume.chapters[this.volume.chapters.findIndex(x => x.id === Number(cid))].id)
              .subscribe((data: any) => {
                this.chapter = data.chapter;
                this.hs.updateBrowserMeta(this.novel.nvl_title + ' | ' + this.chapter.chp_title, 'Edición de capitulo ' + this.chapter.chp_title);
                this.location.replaceState('/mis-novelas/' + this.novel.id + '/' +
                this.novel.nvl_name + '/' + this.volume.id + '/' + this.chapter.id + '/' + this.chapter.chp_name);
                this.loading = false;
                if (this.user === this.novel.nvl_author || this.user === this.chapter.chp_author) {
                  this.editableChapter = true;
                }
              });
            } else {
              this.router.navigate(['mis-novelas', this.novel.id, this.novel.nvl_name]);
            }
          } else {
            this.chapter = new Chapter();
            this.chapter.nvl_id = this.novel.id;
            this.location.replaceState('/mis-novelas/' + this.novel.id + '/' + this.novel.nvl_name + '/' + this.volume.id + '/nuevo');
            this.chapter.chp_status = 'Disabled';
            this.chapter.vlm_id = this.volume.id;
            this.chapter.chp_content = '';
            this.chapter.chp_review = '';
            this.chapter.vlm_id = this.volume.id;  
            const AllChaptersNumbers = []
            for (const volume of this.novel.volumes) {
              const ChaptersNumbers = volume.chapters.map( chapterNumber => chapterNumber.chp_number)
              for (const ChapterNumber of ChaptersNumbers) {
                AllChaptersNumbers.push(ChapterNumber);
              }
            }
            if (AllChaptersNumbers.length > 0) {
              this.chapter.chp_number = Math.max.apply(Math, AllChaptersNumbers) + 1;
            } else {
              this.chapter.chp_number = this.novel.nvl_chapters + 1;
            } 
            this.editableChapter = true;
            this.loading = false;
          }
        } else {
          this.router.navigate(['mis-novelas', this.novel.id, this.novel.nvl_name]);
        }
      } else {
        this.router.navigate(['mis-novelas']);
      }
    }, error => {
      this.router.navigate(['mis-novelas']);
    });
  }

  swichtVolume(vlmId: number) {
    if (this.novel.volumes.findIndex(x => x.id === vlmId) !== -1) {
      this.volume = this.novel.volumes[this.novel.volumes.findIndex(x => x.id === vlmId)];
      if (this.chapter.id) {
        this.location.replaceState('/mis-novelas/' + this.novel.id + '/' +
        this.novel.nvl_name + '/' + this.volume.id + '/' + this.chapter.id + '/' + this.chapter.chp_name);
      } else {
        this.location.replaceState('/mis-novelas/' + this.novel.id + '/' + this.novel.nvl_name + '/' + this.volume.id + '/nuevo');
      }
    } else {
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Volumen invalido';
      return;
    }
  }

  saveChapter(chapterForm: NgForm) {
    if ( this.uploading || chapterForm.invalid || !chapterForm.dirty ) {
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Formulario invalido';
      return;
    }
    this.uploading = true;
    let request: Observable<any>;
    if (this.chapter.id) {
      request = this.ns.updateChapter(this.chapter);
    } else {
      request = this.ns.createChapter(this.chapter);
    }
    request.subscribe( resp => {
      this.chapter.chp_title = resp.chapter.chp_title;
      if (this.chapter.id === undefined || this.chapter.id === null) {
          this.chapter.id = resp.chapter.id;
          this.volume.chapters.push(this.chapter);
          this.ps.openMatSnackBar(this.successSnackRef);
          this.successSnackMessage = '¡Capitulo creado!';
      } else {
        this.ps.openMatSnackBar(this.successSnackRef);
        this.successSnackMessage = '¡Cambios guardados!';
      }
      this.chapter.chp_title = resp.chapter.chp_title;
      this.chapter.chp_name = resp.chapter.chp_name;
      this.chapter.chp_index_title = resp.chapter.chp_index_title;
      this.location.replaceState('/mis-novelas/' + this.novel.id + '/' +
      this.novel.nvl_name + '/' + this.volume.id + '/' + this.chapter.id + '/' + this.chapter.chp_name);
      chapterForm.form.markAsPristine();
      for (const volume of this.novel.volumes) {
        if (volume.chapters.findIndex(x => x.id === this.chapter.id) !== -1) {
          volume.chapters[volume.chapters.findIndex(x => x.id === this.chapter.id)].chp_status = resp.chapter.chp_status;
        }
      }
      this.evaluateEditableNovelStatus();
      this.uploading = false;
    }, error => {
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
      this.uploading = false;
    });
  }

  evaluateEditableNovelStatus() {
    for (const [i, volume] of this.novel.volumes.entries()) {
      const chaptersStatus = volume.chapters.map(
        chapterStatus => chapterStatus.chp_status);
      if (chaptersStatus.includes('Active')) {
        return;
      } else {
        if (i + 1 === this.novel.volumes.length) {
          const disableNovel: Novel = {
            id: this.novel.id,
            nvl_status: 'Disabled'
          };
          this.ns.updateNovel(disableNovel).subscribe((data: any) => {
            this.novel.nvl_status = data.novel.nvl_status;
          }, error => {
            this.ps.openMatSnackBar(this.errorSnackRef);
            this.errorSnackMessage = error.error.message;
          });
        }
      }
    }
  }

  deleteChapter() {
    this.uploading = true;
    if (this.editableChapter && this.chapter.id) {
      this.ns.deleteChapter(this.chapter.id).subscribe((data: any) => {
        this.uploading = false;
        this.ps.dialogCloseAll();
        this.router.navigate(['mis-novelas', this.novel.id, this.novel.nvl_name]);
      });
    } else {
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'No autorizado';
      return;
    }
  }

  goBackToNovel(chapterForm?: NgForm, confirmed?: boolean) {
    if (chapterForm?.dirty && !confirmed) {
      this.ps.openDialogSheet(this.confirmExitComponentModalref);
    } else {
      this.router.navigate(['mis-novelas', this.novel.id, this.novel.nvl_name]);
    }
  }
}

import { Component, OnInit, ViewChild, TemplateRef, Inject, PLATFORM_ID } from '@angular/core';
import { NovelsService } from '../../../../../services/novels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Novel, Volume, Chapter } from 'src/app/models/models';
import { Location, isPlatformBrowser } from '@angular/common';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../../../../services/admin.service';
import { UsersService } from '../../../../../services/users.service';

@Component({
  selector: 'app-chapter-management',
  templateUrl: './chapter-management.component.html',
  styleUrls: ['./chapter-management.component.scss']
})
export class ChapterManagementComponent implements OnInit {

  public Editor;
  public ckEditorConfig;
  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  @ViewChild('confirmExitComponentModal') confirmExitComponentModalref: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  novel: Novel;
  volume: Volume;
  chapter: Chapter;
  loading = true;
  uploading = false;
  componentName: string;
  isBrowser: boolean;

  constructor(private ns: NovelsService,
              private as: AdminService,
              private us: UsersService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private router: Router,
              public dialog: MatDialog,
              public matSnackBar: MatSnackBar,
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
              this.componentName = 'ChaptersComponent';
  }

  openDialogSheet(template: TemplateRef<any>): void {
    this.dialog.open(template);
  }
  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  ngOnInit(): void {
    const nid = this.activatedRoute.snapshot.paramMap.get('nid');
    const vid = Number(this.activatedRoute.snapshot.paramMap.get('vid'));
    const cid = this.activatedRoute.snapshot.paramMap.get('cid');
    this.as.adminGetNovel(this.us.getUserLoged().token, Number(nid)).subscribe((novelData: any) => {
      this.novel = novelData.novel[0];
      if (this.novel.volumes.findIndex(x => x.id === vid) !== -1) {
        this.volume = this.novel.volumes[this.novel.volumes.findIndex(x => x.id === vid)];
        if (this.volume.chapters.findIndex(x => x.id === Number(cid)) !== -1) {
          this.as.adminGetChapter(this.us.getUserLoged().token,
          this.volume.chapters[this.volume.chapters.findIndex(x => x.id === Number(cid))].id)
          .subscribe((data: any) => {
            this.chapter = data.chapter;
            this.loading = false;
          });
        } else {
          this.router.navigate(['panel/administracion-de-novelas', this.novel.id]);
        }
      } else {
        this.router.navigate(['panel/administracion-de-novelas', this.novel.id]);
      }
    }, error => {
      this.router.navigate(['panel/administracion-de-novelas']);
    });
  }

  swichtVolume(vlmId: number) {
    if (this.novel.volumes.findIndex(x => x.id === vlmId) !== -1) {
      this.volume = this.novel.volumes[this.novel.volumes.findIndex(x => x.id === vlmId)];
      this.location.replaceState('/panel/administracion-de-novelas/' + this.novel.id + '/' + this.volume.id + '/' + this.chapter.id);
    } else {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Volumen invalido';
      return;
    }
  }

  saveChapter(chapterForm: NgForm) {
    if ( this.uploading || chapterForm.invalid || !chapterForm.dirty ) {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Formulario invalido';
      return;
    }
    this.uploading = true;
    this.as.adminUpdateChapter(this.us.getUserLoged().token, this.chapter).subscribe((resp: any) => {
      this.chapter.chp_title = resp.chapter.chp_title;
      this.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '¡Cambios guardados!';
      this.chapter.chp_title = resp.chapter.chp_title;
      this.chapter.chp_name = resp.chapter.chp_name;
      this.chapter.chp_index_title = resp.chapter.chp_index_title;
      chapterForm.form.markAsPristine();
      for (const volume of this.novel.volumes) {
        if (volume.chapters.findIndex(x => x.id === this.chapter.id) !== -1) {
          volume.chapters[volume.chapters.findIndex(x => x.id === this.chapter.id)].chp_status = resp.chapter.chp_status;
        }
      }
      this.evaluateEditableNovelStatus();
      this.uploading = false;
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
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
          this.as.adminUpdateNovel(this.us.getUserLoged().token, disableNovel).subscribe((data: any) => {
            this.novel.nvl_status = data.novel.nvl_status;
          }, error => {
            this.openMatSnackBar(this.errorSnackRef);
            this.errorSnackMessage = error.error.message;
          });
        }
      }
    }
  }

  deleteChapter() {
    this.uploading = true;
    this.as.adminDeleteChapter(this.us.getUserLoged().token, this.chapter.id).subscribe((data: any) => {
      this.uploading = false;
      this.dialog.closeAll();
      this.router.navigate(['panel/administracion-de-novelas', this.novel.id]);
    });
  }

  goBackToNovel(chapterForm?: NgForm, confirmed?: boolean) {
    if (chapterForm?.dirty && !confirmed) {
      this.dialog.open(this.confirmExitComponentModalref);
    } else {
      this.router.navigate(['panel/administracion-de-novelas', this.novel.id]);
    }
  }
}

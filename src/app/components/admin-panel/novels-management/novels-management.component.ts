import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { UsersService } from '../../../services/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Novel, Genre } from 'src/app/models/models';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { NovelsService } from '../../../services/novels.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-novels-management',
  templateUrl: './novels-management.component.html',
  styleUrls: ['./novels-management.component.scss']
})
export class NovelsManagementComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('novelsPaginator', {static: true}) novelsPaginator: MatPaginator;
  @ViewChild('genresPaginator', {static: true}) genresPaginator: MatPaginator;
  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  novelsDisplayedColumns: string[];
  novelsDataSource: any;
  genresDataSource: any;
  genresDisplayedColumns = ['id', 'genre_name'];
  novels: Array<Novel>;
  genres: Array<Genre>;
  genre: Genre;
  currentTab = 'novels';
  loading = true;
  uploading = false;
  mobile: boolean;
  NewGenreForm: FormGroup;

  constructor(private router: Router,
              private as: AdminService,
              private us: UsersService,
              private ns: NovelsService,
              public dialog: MatDialog,
              public bottomSheet: MatBottomSheet,
              private breakpointObserver: BreakpointObserver,
              public matSnackBar: MatSnackBar) {

                this.NewGenreForm = new FormGroup({
                  genre_name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
                });
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  ngOnInit(): void {
    this.breakpointObserver
    .observe([Breakpoints.Large = '(max-width: 1151px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.mobile = true;
        this.novelsDisplayedColumns = ['id', 'nvl_title', 'nvl_status'];
      } else {
        this.mobile = false;
        this.novelsDisplayedColumns = ['id', 'user_login', 'nvl_title', 'nvl_status'];
      }
    });

    this.ns.getGenres().subscribe((data: any) => {
      this.genres = data.genres;
      this.genresDataSource = new MatTableDataSource(this.genres);
      this.genresDataSource.paginator = this.genresPaginator;
    }, error => {
      this.router.navigate(['']);
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });

    this.as.adminGetNovels(this.us.getUserLoged().token).subscribe((data: any) => {
      this.novels = data.novels;
      this.novelsDataSource = new MatTableDataSource(this.novels);
      this.novelsDataSource.sort = this.sort;
      this.novelsDataSource.paginator = this.novelsPaginator;
      this.loading = false;
    }, error => {
      this.router.navigate(['']);
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  openDialogSheet(template: TemplateRef<any>): void {
    this.dialog.open(template);
  }

  openBottomSheet(item): void {
    this.bottomSheet.open(item);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.novelsDataSource.filter = filterValue.trim().toLowerCase();
  }

  swichtTab(tab: string) {
    this.currentTab = tab;
  }

  editGenre(genre: Genre) {
    this.genre = genre;
  }

  createGenre() {
    this.uploading = true;
    this.as.adminCreateGenre(this.us.getUserLoged().token, this.NewGenreForm.value).subscribe((data: any) => {
      // this.genres.push(data.genre);
      this.genresDataSource.data.push(data.genre);
      this.genresDataSource.data = this.genresDataSource.data.slice();
      this.uploading = false;
      this.dialog.closeAll();
      this.NewGenreForm.reset();
      this.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '!Genero creado!';
    }, error => {
      this.uploading = false;
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  updateGenre() {
    this.uploading = true;
    this.as.adminUpdateGenre(this.us.getUserLoged().token, this.genre).subscribe((data: any) => {
      // this.genres.push(data.genre);
      this.uploading = false;
      this.openMatSnackBar(this.successSnackRef);
      this.dialog.closeAll();
      this.successSnackMessage = '!Genero actualizado!';
    }, error => {
      this.uploading = false;
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

  deleteGenre() {
    this.uploading = true;
    this.as.adminDeleteGenre(this.us.getUserLoged().token, this.genre.id).subscribe((data: any) => {
      this.genresDataSource.data.splice(this.genresDataSource.data.findIndex(x => x.id === this.genre.id), 1);
      this.genresDataSource.data = this.genresDataSource.data.slice();
      this.uploading = false;
      this.openMatSnackBar(this.successSnackRef);
      this.successSnackMessage = '!Genero eliminado!';
    }, error => {
      this.uploading = false;
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

}

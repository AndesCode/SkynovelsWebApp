import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NovelsService } from '../../services/novels.service';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-novels',
  templateUrl: './novels.component.html',
  styleUrls: ['./novels.component.scss']
})
export class NovelsComponent implements OnInit {

  novels: any;
  bookmarks = false;
  user_reading_list: any[] = [];
  novelFilter = {
    searchName: '',
    searchGenres: []
  };
  genres: any[] = [];
  smallScreen = false;

  constructor(private router: Router,
              private _ns: NovelsService,
              public _hs: HelperService,
              private location: Location) { }

  ngOnInit(): void {
    this._ns.getNovels().subscribe((data: any) => {
      this.novels = data.novels;
      // this.setImg();
      console.log(this.novels);
      this.allGenres();
    });
  }

  goToBookmark(nvl_name: any, nvl_chapter: any) {
    if (nvl_chapter === null || nvl_chapter === 0) {
      this.router.navigate(['/novela', nvl_name]);
    } else {
      this.router.navigate(['/novela', nvl_name, nvl_chapter]);
    }
  }

  allGenres() {
    this._ns.getGenres().subscribe((genres: any) => {
      this.genres = genres.genres;
    });
  }

  getGenresFilterArray() {
    this.novelFilter.searchGenres = [];
    for (let i = 0; i < this.genres.length; i++) {
      if (this.genres[i].check === true) {
        this.novelFilter.searchGenres.push(this.genres[i].id);
      }
    }
    console.log(this.novelFilter);
  }

  goToLastChapter(novelName: any, chpNmber: number) {
    this.location.go('/novela/' + novelName + '/' + chpNmber);
    // this.router.navigate(['/novela', novelName, chpNmber]);
  }
}

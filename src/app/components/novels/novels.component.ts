import { Component, OnInit } from '@angular/core';
import { NovelsService } from '../../services/novels.service';
import { HelperService } from '../../services/helper.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Genre, NovelFilter, Novel } from 'src/app/models/models';

@Component({
  selector: 'app-novels',
  templateUrl: './novels.component.html',
  styleUrls: ['./novels.component.scss']
})
export class NovelsComponent implements OnInit {

  novels: Array<Novel>;
  bookmarks = false;
  novelFilter: NovelFilter = {
    searchName: '',
    searchStatus: 'All',
    orderBy: 'date_data',
    searchGenres: []
  };
  genres: Array<Genre> = [];
  smallScreen = false;
  mobile: boolean;
  loading = true;

  constructor(private ns: NovelsService,
              public hs: HelperService,
              private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.ns.getGenres().subscribe((genres: any) => {
      this.genres = genres.genres;
    });
    this.ns.getNovels().subscribe((data: any) => {
      this.novels = data.novels;
      console.log(this.novels);
      this.loading = false;
    });

    this.breakpointObserver
    .observe('(max-width: 1000px)')
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.mobile = true;
        console.log(this.mobile);
      } else {
        this.mobile = false;
      }
    });
  }
}

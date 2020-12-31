import { Component, Input, OnChanges } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';
import { NovelFilter, Novel } from 'src/app/models/models';
import { PageService } from '../../../services/page.service';

@Component({
  selector: 'app-novel-card',
  templateUrl: './novel-card.component.html',
  styleUrls: ['./novel-card.component.scss']
})
export class NovelCardComponent implements OnChanges {

  @Input() novels: Array<Novel>;
  @Input() clickRoute = '';
  @Input() novelFilter: NovelFilter = {
    searchName: '',
    searchStatus: 'All',
    orderBy: 'nvl_title',
    searchGenres: []
  };
  @Input() orderBy: string;
  goToNovelLink: string;
  page = 1;
  itemsPerPage: number;

  constructor(public hs: HelperService,
              public ps: PageService,
              private router: Router) { }

  ngOnChanges() {
    if (this.novels) {
      for (const novel of this.novels) {
        if (!novel.date_data) {
          novel.date_data = this.hs.getRelativeTime(novel.nvl_last_update);
          if (novel.nvl_status === 'Finished') {
            novel.nvl_status = 'Finalizada';
          } else {
            if (novel.date_data.seconds === 0) {
              novel.nvl_status = 'Oculta';
            } else {
              if (novel.date_data.seconds > 1296000) {
                novel.nvl_status = 'Inactiva';
              } else {
                novel.nvl_status = 'Activa';
              }
            }
          }
        }
      }
    }
    if (this.clickRoute === 'userNovel') {
      this.itemsPerPage = 9999;
      this.goToNovelLink = '/mis-novelas';
    } else {
      this.itemsPerPage = 25;
      this.goToNovelLink = '/novelas';
    }
  }

  scrollToTop() {
    window.scroll(0, 0)
  }


  goToNovel(novel) {
    if (this.clickRoute === 'userNovel') {
      this.router.navigate(['/mis-novelas/', novel.id, novel.nvl_name]);
    } else {
      this.router.navigate(['/novelas/' , novel.id, novel.nvl_name]);
    }
  }
}

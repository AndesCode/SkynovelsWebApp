import { Component, Input, OnChanges } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { NovelsService } from '../../../services/novels.service';
import { Router } from '@angular/router';
import { NovelFilter, Novel } from 'src/app/models/models';

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
    searchGenres: []
  };
  goToNovelLink: string;

  constructor(public hs: HelperService,
              private ns: NovelsService,
              private router: Router) { }

  ngOnChanges() {
    console.log(this.novelFilter);
    if (this.novels) {
      for (const novel of this.novels) {
        // tslint:disable-next-line: max-line-length
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
      this.novels = this.novels.sort(this.hs.dateDataSorter);
      console.log(this.novels);
    }
    if (this.clickRoute === 'userNovel') {
      this.goToNovelLink = '/mis-novelas';
    } else {
      this.goToNovelLink = '/novelas';
    }
  }

  goToNovel(novel) {
    if (this.clickRoute === 'userNovel') {
      this.router.navigate(['/mis-novelas/', novel.id, novel.nvl_name]);
    } else {
      this.router.navigate(['/novelas/' , novel.id, novel.nvl_name]);
    }
  }
}

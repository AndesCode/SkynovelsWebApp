import { Component, Input, OnChanges } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { NovelsService } from '../../../services/novels.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-novel-card',
  templateUrl: './novel-card.component.html',
  styleUrls: ['./novel-card.component.scss']
})
export class NovelCardComponent implements OnChanges {

  @Input() novels: any[] = [];
  @Input() clickRoute = '';
  @Input() novelFilter = {
    searchName: '',
    searchGenres: []
  };

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
      for (const novel of this.novels) {
        if (novel.nvl_img !== ''
        && novel.nvl_img !== null
        && novel.nvl_img !== undefined) {
          this.ns.getNovelImage(novel.nvl_img).subscribe((data: any) => {
            console.log(data);
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              novel.nvl_img = reader.result;
            }, false);
            if (data) {
                reader.readAsDataURL(data);
            }
          }, error => {
            novel.nvl_img = '../../../assets/img/noimage.jpg';
          });
        } else {
          novel.nvl_img = '../../../assets/img/noimage.jpg';
        }
      }
      console.log(this.novels);
    }
  }

  goToNovel(novel) {
    if (this.clickRoute === 'userNovel') {
      this.router.navigate(['/mi-novela/' , novel.id]);
    } else {
      this.router.navigate(['/novelas/' , novel.id, novel.nvl_name]);
    }
  }
}

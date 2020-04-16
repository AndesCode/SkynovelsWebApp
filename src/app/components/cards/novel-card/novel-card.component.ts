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

  constructor(public _hs: HelperService,
              private _ns: NovelsService,
              private router: Router) { }

  ngOnChanges() {
    console.log(this.novelFilter);
    if (this.novels) {
      for (let i = 0; i < this.novels.length; i++) {
        // tslint:disable-next-line: max-line-length
        this.novels[i].date_data = this._hs.getRelativeTime(this.novels[i].nvl_last_update);
        if (this.novels[i].nvl_status === 'Finished') {
          this.novels[i].nvl_status = 'Finalizada';
        } else {
          if (this.novels[i].date_data.seconds > 1296000) {
            this.novels[i].nvl_status = 'Inactiva';
          } else {
            this.novels[i].nvl_status = 'Activa';
          }
        }

      }
      this.novels = this.novels.sort(this._hs.dateDataSorter);
      for (let i = 0; i < this.novels.length; i++) {
        if (this.novels[i].nvl_img !== ''
        && this.novels[i].nvl_img !== null
        && this.novels[i].nvl_img !== undefined) {
          this._ns.getNovelImage(this.novels[i].nvl_img).subscribe((data: any) => {
            console.log(data);
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              this.novels[i].nvl_img = reader.result;
            }, false);
            if (data) {
                reader.readAsDataURL(data);
            }
          }, error => {
            this.novels[i].nvl_img = '../../../assets/img/noimage.jpg';
          });
        } else {
          this.novels[i].nvl_img = '../../../assets/img/noimage.jpg';
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

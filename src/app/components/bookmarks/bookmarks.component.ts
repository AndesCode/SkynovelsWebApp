import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { Novel } from 'src/app/models/models';
import { PageService } from '../../services/page.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  bookmarks: Array<Novel> = [];
  loading = true;
  loadingError = false;
  componentName = 'BookmarksComponent';

  constructor(private us: UsersService,
              private router: Router,
              public ps: PageService,
              private hs: HelperService) { }

  ngOnInit(): void {
    this.hs.updateBrowserMeta('description', 'novelas en lista de lectura', 'SkyNovels | Lista de lectura');
    this.hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'reloadUser') {
        this.router.navigate(['']);
      }
    });
    if (this.us.userIsLoged) {
      this.us.getUserBookmarks().subscribe((data: any) => {
        this.bookmarks = data.novels;
        this.loading = false;
        for (const novel of this.bookmarks) {
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
      }, error => {
        this.loadingError = true;
      });
    } else {
      this.router.navigate(['']);
    }
  }

}

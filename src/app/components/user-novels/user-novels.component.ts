import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-user-novels',
  templateUrl: './user-novels.component.html',
  styleUrls: ['./user-novels.component.scss']
})
export class UserNovelsComponent implements OnInit {

  userCollaborations: any[] = [];
  userNovels: any[] = [];
  searchText: String;
  currentTab: any = 'novel';

  constructor(public _auth: AuthService,
              public _ns: AppService,
              public _hs: HelperService,
              private router: Router,
              private _us: UsersService) {}

  ngOnInit() {
    this._us.getUserNovels().subscribe((data: any) => {
      this.userNovels = data.novels;
      this.userCollaborations = data.collaborations;
      console.log(data);
      /*for (let i = 0; i < this.user_novels.length; i++) {
        const datesDataFiltered = this._ns.getDiferenceInDaysBetweenDays(this.user_novels[i].createdAt, this.user_novels[i].updatedAt);
        if ( this.user_novels[i].createdAt === this.user_novels[i].updatedAt) {
          this.user_novels[i].last_update = datesDataFiltered.creation_date_message;
        } else {
          this.user_novels[i].last_update = datesDataFiltered.update_date_message;
        }
      }*/
    }, error => {
      console.log(error);
      this.router.navigate(['']);
    });
  }

  switchTab(tab: string) {
    this.currentTab = tab;
    this.searchText = '';
  }

  goToCreateNovel() {
    this.router.navigate(['/mi-novela/nuevo']);
  }

  goToEditNovel(novel) {
    this.router.navigate(['/mi-novela/' , novel.id]);
  }
}

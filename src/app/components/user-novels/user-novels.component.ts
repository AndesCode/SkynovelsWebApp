import { Component, OnInit } from '@angular/core';
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
  loading = true;

  constructor(public _hs: HelperService,
              private router: Router,
              private _us: UsersService) {}

  ngOnInit() {
    this._us.getUserNovels().subscribe((data: any) => {
      this.userNovels = data.novels;
      this.userCollaborations = data.collaborations;
      this.loading = false;
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
    this.router.navigate(['/mis-novelas/nuevo']);
  }
}

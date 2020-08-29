import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { Novel } from 'src/app/models/models';

@Component({
  selector: 'app-user-novels',
  templateUrl: './user-novels.component.html',
  styleUrls: ['./user-novels.component.scss']
})
export class UserNovelsComponent implements OnInit {

  userCollaborations: Array<Novel> = [];
  userNovels: Array<Novel> = [];
  searchText: string;
  currentTab = 'novel';
  loading = true;
  componentName = 'UserNovelsComponent';

  constructor(private router: Router,
              private us: UsersService) {}

  ngOnInit() {
    this.us.getUserNovels().subscribe((data: any) => {
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

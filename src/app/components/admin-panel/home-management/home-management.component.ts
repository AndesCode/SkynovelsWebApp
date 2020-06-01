import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { UsersService } from '../../../services/users.service';
import { Advertisement } from 'src/app/models/models';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-management',
  templateUrl: './home-management.component.html',
  styleUrls: ['./home-management.component.scss']
})
export class HomeManagementComponent implements OnInit {

  currentTab = 'advertisements';
  advertisements: Array<Advertisement> = [];
  @ViewChild('advertisementPaginator', {static: true}) advertisementPaginator: MatPaginator;
  advertisementsDataSource: any;
  advertisementsDisplayedColumns = ['id', 'adv_order', 'user_login', 'adv_title'];
  loading = true;

  constructor(private as: AdminService,
              public dialog: MatDialog,
              public matSnackBar: MatSnackBar,
              private us: UsersService,
              private router: Router) { }

  ngOnInit(): void {
    this.as.adminGetAdvertisements(this.us.getUserLoged().token).subscribe((data: any) => {
      console.log(data.advertisements);
      this.advertisements = data.advertisements;
      this.advertisementsDataSource = new MatTableDataSource(this.advertisements);
      this.advertisementsDataSource.paginator = this.advertisementPaginator;
      this.loading = false;
    }, error => {
      this.router.navigate(['']);
    });
  }

  swichtTab(tab: string) {
    this.currentTab = tab;
  }
}

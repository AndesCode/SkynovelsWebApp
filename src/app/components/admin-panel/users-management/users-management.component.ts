import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { UsersService } from '../../../services/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html'
})
export class UsersManagementComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private router: Router,
              private as: AdminService,
              private us: UsersService) {
  }


  displayedColumns: string[] = ['id', 'user_login', 'user_status'];
  dataSource: any;
  users: any[] = [];
  user: any = null;
  loading = true;

  ngOnInit(): void {
    this.as.adminGetUsers(this.us.getUserLoged().token).subscribe((data: any) => {
      this.users = data.users;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    }, error => {
      this.router.navigate(['']);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

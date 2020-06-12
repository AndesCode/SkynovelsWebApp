import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { UsersService } from '../../services/users.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {

  mobile: boolean;

  constructor(private route: ActivatedRoute,
              public router: Router,
              public breakpointObserver: BreakpointObserver,
              private us: UsersService,
              private as: AdminService) { }
  adminVerificated = false;
  currentView = 'panel';
  ngOnInit(): void {

    this.breakpointObserver
    .observe([Breakpoints.Large = '(max-width: 1151px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    });

    // Verificando administrador
    this.as.adminPanelAccess(this.us.getUserLoged().token).subscribe((data: any) => {
      console.log(data);
      if (data.status === 200) {
        this.adminVerificated = true;
        // this.router.navigate(['/panel/administracion-de-pagina-de-inicio']);
      } else {
        this.router.navigate(['']);
        this.as.adminPanelErrorHandler(null, true);
      }
    }, error => {
      console.log(error);
      this.router.navigate(['']);
      this.as.adminPanelErrorHandler(error, false);
    });
  }

}

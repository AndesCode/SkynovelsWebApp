import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { UsersService } from '../../services/users.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {

  mobile: boolean;
  componentName = 'AdminPanelComponent';
  adminVerificated = false;
  loading = true;

  constructor(public router: Router,
              public breakpointObserver: BreakpointObserver,
              private us: UsersService,
              private as: AdminService,
              private hs: HelperService) { }

  ngOnInit(): void {
    this.hs.updateBrowserMeta('SkyNovels | Panel de control', 'Panel de control de skynovels', 'https://api.skynovels.net/img/banner1.jpg');
    this.breakpointObserver
    .observe([Breakpoints.Large = '(max-width: 1151px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    });

    this.as.adminPanelAccess(this.us.getUserLoged().token).subscribe((data: any) => {
      if (data.status === 200) {
        this.adminVerificated = true;
        this.loading = false;
        if (this.router.url === '/panel') {
          this.router.navigate(['/panel/administracion-de-pagina-de-inicio']);
        }
      } else {
        this.router.navigate(['']);
        this.as.adminPanelErrorHandler(null, true);
      }
    }, error => {
      this.router.navigate(['']);
      this.as.adminPanelErrorHandler(error, false);
    });
  }

  goToLink(link: string) {
    this.router.navigate([link]);
  }

}

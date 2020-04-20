import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { HelperService } from '../../../services/helper.service';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-navbar',
  templateUrl: './mobile-navbar.component.html',
  styleUrls: ['./mobile-navbar.component.scss']
})
export class MobileNavbarComponent implements OnInit {

  constructor(public _as: AdminService,
              private _hs: HelperService,
              public _us: UsersService,
              private router: Router,
              public breakpointObserver: BreakpointObserver) { }

  open = false;

  ngOnInit(): void {
    this._hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'sideNavBar') {
        this.open = true;
      }
      if (data === 'closeSideNavBar') {
        this.open = false;
      }
    });
  }

  goToMyProfile() {
    this.router.navigate(['/perfil', this._us.getUserLoged().user_login, this._us.getUserLoged().id]);
  }

  closeMobileNavbarForm() {
    this._hs.openExternalFunction('closeSideNavBar');
  }

  navigate() {
    this._hs.openExternalFunction('closeSideNavBarAndScrollNull');
    this.open = false;
  }

  toggleTheme() {
    this._hs.openExternalFunction('toggleTheme');
  }

  openLoginForm() {
    this._hs.openExternalFunction('loginForm');
  }

  openRegisterForm() {
    this._hs.openExternalFunction('registerForm');
  }

  logout() {
    this._us.logOut().subscribe((data: any) => {
      localStorage.clear();
      this._hs.openExternalFunction('reloadUser');
    }, error => {
      localStorage.clear();
      this._hs.openExternalFunction('reloadUser');
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { HelperService } from '../../../services/helper.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

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
              public breakpointObserver: BreakpointObserver,
              private viewportScroller: ViewportScroller) { }

  open = false;
  scrollPosition = 0;

  ngOnInit(): void {
    this._hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'sideNavBar') {
        this.openNav();
      }
      if (data === 'closeSideNavBar') {
        this.closeNav(true);
      }
    });
  }

  openNav() {
    this.open = true;
    const top = '-' + this.viewportScroller.getScrollPosition()[1] + 'px';
    this.scrollPosition = this.viewportScroller.getScrollPosition()[1];
    console.log(top);
    document.documentElement.style.top = top;
    document.documentElement.style.left = '0px';
    document.documentElement.classList.add('cdk-global-scrollblock');
  }

  closeNav(manteinScroll: boolean) {
    this.open = false;
    document.documentElement.classList.remove('cdk-global-scrollblock');
    document.documentElement.removeAttribute('style');
    if (manteinScroll) {
      window.scrollTo(0, this.scrollPosition);
    } else {
      window.scrollTo(0, 0);
    }
  }

  goToMyProfile() {
    this.router.navigate(['/perfil', this._us.getUserLoged().user_login, this._us.getUserLoged().id]);
  }

  closeMobileNavbarForm() {
    this._hs.openExternalFunction('closeSideNavBarCall');
    this.closeNav(true);
  }

  navigate() {
    this._hs.openExternalFunction('closeSideNavBarCall');
    this.closeNav(false);
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

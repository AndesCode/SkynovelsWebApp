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

  constructor(public as: AdminService,
              private hs: HelperService,
              public us: UsersService,
              private router: Router,
              public breakpointObserver: BreakpointObserver,
              private viewportScroller: ViewportScroller) { }

  open = false;
  scrollPosition = 0;

  ngOnInit(): void {
    this.hs.invokeExternalFunction.subscribe((data: any) => {
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
    if (document.body.clientHeight > window.innerHeight) {
      document.documentElement.style.top = top;
      document.documentElement.style.left = '0px';
      document.documentElement.classList.add('cdk-global-scrollblock');
    } else {
      return;
    }
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
    this.router.navigate(['/perfil', this.us.getUserLoged().id, this.us.getUserLoged().user_login]);
  }

  closeMobileNavbarForm() {
    this.hs.openExternalFunction('closeSideNavBarCall');
    this.closeNav(true);
  }

  navigate() {
    this.hs.openExternalFunction('closeSideNavBarCall');
    this.closeNav(false);
  }

  toggleTheme() {
    this.hs.openExternalFunction('toggleTheme');
  }

  openLoginForm() {
    this.hs.openExternalFunction('loginForm');
  }

  openRegisterForm() {
    this.hs.openExternalFunction('registerForm');
  }

  logout() {
    this.hs.openExternalFunction('logOut');
  }

}

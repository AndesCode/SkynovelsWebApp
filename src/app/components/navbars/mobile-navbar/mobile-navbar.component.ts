import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { HelperService } from '../../../services/helper.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent } from 'rxjs';

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
              private viewportScroller: ViewportScroller,
              @Inject(PLATFORM_ID) private platformId) { }

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

    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'popstate').subscribe((e) => {
        if (this.open) {
          this.closeNav(true);
        } 
      });
    }
  }

  openNav() {
    this.open = true;
    const top = '-' + this.viewportScroller.getScrollPosition()[1] + 'px';
    this.scrollPosition = this.viewportScroller.getScrollPosition()[1];
    if (isPlatformBrowser(this.platformId)) {
      if (document.body.clientHeight > window.innerHeight) {
        document.documentElement.style.top = top;
        document.documentElement.style.left = '0px';
        document.documentElement.classList.add('cdk-global-scrollblock');
      } else {
        return;
      }
    } else {
      return;
    }
  }

  closeNav(maintainScrollPosition: boolean) {
    this.hs.openExternalFunction('closeSideNavBarCall');
    this.open = false;
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.remove('cdk-global-scrollblock');
      document.documentElement.removeAttribute('style');
      if (maintainScrollPosition) {
        window.scrollTo(0, this.scrollPosition);
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      return;
    }
  }

  goToMyProfile() {
    this.router.navigate(['/perfil', this.us.getUserLoged().id, this.us.getUserLoged().user_login]);
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

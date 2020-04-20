import { Component, ViewChild, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HelperService } from './services/helper.service';
import { filter } from 'rxjs/operators';
import * as Cookies from 'js-cookie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('skynovelBody') skynovelBodyRef: ElementRef;
  title = 'SkynovelsWebPage';
  themeToggled = false;
  currentComponent = null;
  scrollPosition = 0;
  constructor(public hs: HelperService,
              private router: Router,
              private renderer: Renderer2,
              private viewportScroller: ViewportScroller) {

              const navEndEvents$ = this.router.events
                 .pipe(
                   filter(event => event instanceof NavigationEnd)
                 );

              navEndEvents$.subscribe((event: NavigationEnd) => {
                   console.log(event.urlAfterRedirects);
                  /*gtag('config', 'xxxxxx', {
                    'page_path': event.urlAfterRedirects
                  });*/
                });
              }

  ngAfterViewInit() {
    this.hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'toggleTheme') {
        this.toggleTheme();
      }
      if (data === 'closeSideNavBar') {
        this.mobileNavbarOff(true);
      }
      if (data === 'closeSideNavBarAndScrollNull') {
        this.mobileNavbarOff(false);
      }
      if (data === 'sideNavBar') {
        this.mobileNavbarOn();
      }
    });
    if (Cookies.get('presence') && Cookies.get('presence') === 'dark') {
      this.toggleTheme();
    }
  }

  mobileNavbarOn() {
    const top = '-' + this.viewportScroller.getScrollPosition()[1] + 'px';
    this.scrollPosition = this.viewportScroller.getScrollPosition()[1];
    console.log(top);
    document.documentElement.style.top = top;
    document.documentElement.style.left = '0px';
    document.documentElement.classList.add('cdk-global-scrollblock');
    /*this.renderer.setStyle(this.skynovelHTMLRef.nativeElement, 'top', top);
    this.renderer.setStyle(this.skynovelHTMLRef.nativeElement, 'left', '0px');
    this.renderer.addClass(this.skynovelHTMLRef.nativeElement, 'cdk-global-scrollblock');*/
  }

  mobileNavbarOff(manteinScroll: boolean) {
    document.documentElement.classList.remove('cdk-global-scrollblock');
    document.documentElement.removeAttribute('style');
    if (manteinScroll) {
      window.scrollTo(0, this.scrollPosition);
    } else {
      window.scrollTo(0, 0);
    }
    /*this.renderer.removeStyle(this.skynovelHTMLRef.nativeElement, 'top');
    this.renderer.removeStyle(this.skynovelHTMLRef.nativeElement, 'left');
    this.renderer.removeClass(this.skynovelHTMLRef.nativeElement, 'cdk-global-scrollblock');*/
  }

  toggleTheme() {
    console.log('toogling');
    if (!this.themeToggled) {
      this.themeToggled = true;
      this.renderer.setAttribute(this.skynovelBodyRef.nativeElement, 'theme', 'dark');
      Cookies.set('presence', 'dark');
    } else {
      this.themeToggled = false;
      this.renderer.setAttribute(this.skynovelBodyRef.nativeElement, 'theme', 'light');
      Cookies.set('presence', 'light');
    }
  }

  onActivate(event: any) {
    console.log(event);
    this.currentComponent = event.__proto__.constructor.name;
    this.hs.getCurrentComponent(this.currentComponent); // modificando aqui
  }
}

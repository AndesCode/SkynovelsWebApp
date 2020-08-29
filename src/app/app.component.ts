import { Component, ViewChild, AfterViewInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router, NavigationEnd, Routes, ActivatedRoute } from '@angular/router';
import { HelperService } from './services/helper.service';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
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
  isBrowser: boolean;
  constructor(public hs: HelperService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              // private renderer: Renderer2,
              @Inject(PLATFORM_ID) private platformId) {

              this.isBrowser = isPlatformBrowser(this.platformId);
              const navEndEvents$ = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
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
    });
    if (Cookies.get('presence') && Cookies.get('presence') === 'dark') {
      this.toggleTheme();
    }
  }

  toggleTheme() {
    if (this.isBrowser) {
      console.log('toogling');
      if (!this.themeToggled) {
        this.themeToggled = true;
        // this.renderer.setAttribute(this.skynovelBodyRef.nativeElement, 'theme', 'dark');
        document.body.setAttribute('theme', 'dark');
        Cookies.set('presence', 'dark');
      } else {
        this.themeToggled = false;
        // this.renderer.setAttribute(this.skynovelBodyRef.nativeElement, 'theme', 'light');
        document.body.setAttribute('theme', 'light');
        Cookies.set('presence', 'light');
      }
    } else {
      return;
    }
  }

  onActivate(event: any) {
    console.log(event);
    if (event.componentName) {
      this.currentComponent = event.componentName;
      this.hs.getCurrentComponent(this.currentComponent); // modificando aqui
    } else {
      this.currentComponent = null;
    }
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }
}

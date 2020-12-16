import { Component, ViewChild, AfterViewInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HelperService } from './services/helper.service';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import * as Cookies from 'js-cookie';
import { Meta } from '@angular/platform-browser';
import { Prod } from './config/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('skynovelBody') skynovelBodyRef: ElementRef;
  themeToggled = false;
  currentComponent = null;
  scrollPosition = 0;
  isBrowser: boolean;
  constructor(private hs: HelperService,
              private router: Router,
              private meta: Meta,
              private prod: Prod,
              @Inject(PLATFORM_ID) private platformId) {

                this.isBrowser = isPlatformBrowser(this.platformId);
                if (this.isBrowser) {
                  const navEndEvents$ = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
                  navEndEvents$.subscribe((event: NavigationEnd) => {
                    const canonicalUrl = document.querySelector('[rel="canonical"]');
                    if (event.urlAfterRedirects === '/') {
                      this.meta.updateTag({content: this.prod.url}, 'name=urlskn');
                      canonicalUrl.setAttribute('href', this.prod.url + '/');
                    } else {
                      this.meta.updateTag({content: this.prod.url + event.urlAfterRedirects}, 'name=urlskn');
                      canonicalUrl.setAttribute('href', this.prod.url + event.urlAfterRedirects + '/');
                    }
                    /*gtag('config', 'xxxxxx', {
                      'page_path': event.urlAfterRedirects
                    });*/
                  });
                }
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
      if (!this.themeToggled) {
        this.themeToggled = true;
        // this.renderer.setAttribute(this.skynovelBodyRef.nativeElement, 'theme', 'dark');
        document.body.setAttribute('theme', 'dark');
        Cookies.set('presence', 'dark', { expires: 65 });
      } else {
        this.themeToggled = false;
        // this.renderer.setAttribute(this.skynovelBodyRef.nativeElement, 'theme', 'light');
        document.body.setAttribute('theme', 'light');
        Cookies.set('presence', 'light', { expires: 65 });
      }
    } else {
      return;
    }
  }

  onActivate(event: any) {
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

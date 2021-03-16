import { Component, AfterViewInit, Inject, PLATFORM_ID, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HelperService } from './services/helper.service';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { Prod } from './config/config';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

// ng generate component components/add-test-two --module=app.module

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild("app") appRef: ElementRef;
  themeToggled = false;
  currentComponent = null;
  scrollPosition = 0;
  isBrowser: boolean;
  isCopyPage: boolean;
  constructor(private hs: HelperService,
              private router: Router,
              private meta: Meta,
              private prod: Prod,
              private gtmService: GoogleTagManagerService,
              private renderer: Renderer2,
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
                    const gtmTag = {
                      event: 'page',
                      pageName: event.urlAfterRedirects
                    };
                    this.gtmService.pushTag(gtmTag);
                  });
                }
              }

  ngAfterViewInit() {
    this.hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'toggleTheme') {
        this.toggleTheme();
      }
    });
    if (this.isBrowser) {
      if (!window.location.href.includes('skynovels.net') && !window.location.href.includes('localh')) {
        this.isCopyPage = true;
      }
      if (localStorage.getItem('presence') && localStorage.getItem('presence') === 'dark') {
        this.toggleTheme();
      }
      const wrapper = document.getElementById('main-wrapper')
      const observer = new MutationObserver(function (mutations, observer) {
        wrapper.style.height = ''
        wrapper.style.minHeight = ''
      })
      observer.observe(wrapper, {
        attributes: true,
        attributeFilter: ['style']
      })
    }
  }

  toggleTheme() {
    if (this.isBrowser) {
      if (!this.themeToggled) {
        this.themeToggled = true;
        document.body.setAttribute('theme', 'dark');
        localStorage.setItem('presence', 'dark');
      } else {
        this.themeToggled = false;
        document.body.setAttribute('theme', 'light');
        localStorage.setItem('presence', 'light');
      }
    } else {
      return;
    }
  }

  onActivate(event: any) {
    if (event.componentName) {
      this.currentComponent = event.componentName;
      this.hs.getCurrentComponent(this.currentComponent);
    } else {
      this.currentComponent = null;
    }
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      if (this.currentComponent === 'ChaptersComponent') {
        document.body.style.overflow = 'hidden';
        this.renderer.setStyle(this.appRef.nativeElement, 'margin-top', '0px');
      } else {
        if (this.currentComponent === 'AdminPanelComponent') {
          document.body.style.overflow = 'hidden';
          this.renderer.setStyle(this.appRef.nativeElement, 'margin-top', '4.063rem');
        } else {
          document.body.style.overflow = 'auto';
          this.renderer.setStyle(this.appRef.nativeElement, 'margin-top', '4.063rem');
        }
      }
    }
  }
}

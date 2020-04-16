import { Injectable, InjectionToken } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppComponent } from './app.component';

export const OVERLAY_PARENT_HTML = new InjectionToken<string>('OVERLAY_PARENT_HTML');

@Injectable({providedIn: 'root'})

export class CdkOverlayContainer extends OverlayContainer {

    /**
     * Set the container element from the outside, e.g. from the corresponding directive
     */
    _createContainer(): void {
      const container = document.createElement('div');
      container.classList.add('cdk-overlay-container');
      document.querySelector('#content-container').appendChild(container);
      this._containerElement = container;
    }
}

// https://stackblitz.com/edit/angular-material-overlay-in-app-root?file=app%2Fin-app-root-overlay-container.ts
// https://blog.bbogdanov.net/post/angular-material-overlay-hack-overlay-container/
// https://stackblitz.com/edit/angular-material2-issue-ansnt5?file=app%2Fcustom-overlay-container.ts
// https://stackblitz.com/edit/angular-material2-issue-6nzwws?embed=1&file=app/app.component.html

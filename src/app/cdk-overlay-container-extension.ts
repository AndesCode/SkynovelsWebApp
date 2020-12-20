import { Injectable, InjectionToken } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

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

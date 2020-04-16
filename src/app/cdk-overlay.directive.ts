import { Directive, Renderer2, ElementRef } from '@angular/core';
import { CdkOverlayContainer } from './cdk-overlay-container-extension';

@Directive({
  selector: '[appCdkOverlay]'
})
export class CdkOverlayDirective{
  protected renderer: Renderer2;
  protected elementReference: ElementRef;
  protected cdkOverlayContainer: CdkOverlayContainer;
  constructor(renderer: Renderer2, elementReference: ElementRef, cdkOverlayContainer: CdkOverlayContainer) {
      this.renderer            = renderer;
      this.elementReference    = elementReference;
      this.cdkOverlayContainer = cdkOverlayContainer;
      // this.renderer.addClass(this.elementReference.nativeElement, 'cdk-overlay-container');
      // this.cdkOverlayContainer.getRootElement(this.elementReference.nativeElement);
      // this.cdkOverlayContainer.setParentElement(this.elementReference.nativeElement);
  }
}

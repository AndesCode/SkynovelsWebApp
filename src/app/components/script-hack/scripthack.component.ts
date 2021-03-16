import { Component, ElementRef, ViewChild, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'script-hack',
    templateUrl: './scripthack.component.html'
})
export class ScriptHackComponent {

    @Input()
    src: string;
    @Input()
    type: string;
    @ViewChild('script') script: ElementRef;
    isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId) { 
          this.isBrowser = isPlatformBrowser(this.platformId);
    }

    convertToScript() {
        const element = this.script.nativeElement;
        const script = document.createElement("script");
        script.type = this.type ? this.type : "text/javascript";
        if (this.src) {
            script.src = this.src;
        }
        if (element.innerHTML) {
            script.innerHTML = element.innerHTML;
        }
        const parent = element.parentElement;
        parent.parentElement.replaceChild(script, parent);
    }

    ngAfterViewInit() {
        if (this.isBrowser) {
            this.convertToScript();
        }    
    }
}
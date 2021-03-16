import { Component, Input } from '@angular/core';
import { Block3 } from 'src/app/config/yieldlove';

@Component({
    selector: 'ad-block3',
    templateUrl: './yieldlove-block3.html'
})
export class YieldLoveBlock3 {

    // yieldlove blocks
    block3Desktop: string;
    block3Mobile: string;
    block3Div: string;
    mainScript: string;

    @Input()
    mobile: boolean;

    constructor(private block3: Block3) {
        this.block3Desktop = block3.scriptDesktop
        this.block3Mobile = block3.scriptMobile
        this.block3Div = block3.divScript
      }

    ngOnInit() {
        if (this.mobile) {
            this.mainScript = this.block3Mobile
        } else {
            this.mainScript = this.block3Desktop
        }

    }
}
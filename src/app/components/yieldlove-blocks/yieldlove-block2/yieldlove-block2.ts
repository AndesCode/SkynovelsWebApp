import { Component, Input } from '@angular/core';
import { Block2 } from 'src/app/config/yieldlove';

@Component({
    selector: 'ad-block2',
    templateUrl: './yieldlove-block2.html'
})
export class YieldLoveBlock2 {

    // yieldlove blocks
    block2Desktop: string;
    block2Mobile: string;
    block2Div: string;
    mainScript: string;

    @Input()
    mobile: boolean;

    constructor(private block2: Block2) {
        this.block2Desktop = block2.scriptDesktop
        this.block2Div = block2.divScript
      }

    ngOnInit() {
        if (this.mobile) {
            this.mainScript = this.block2Desktop
        } else {
            this.mainScript = this.block2Desktop
        }

    }
}
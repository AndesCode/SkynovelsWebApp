import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { Block1 } from 'src/app/config/yieldlove';

@Component({
    selector: 'ad-block1',
    templateUrl: './yieldlove-block1.html'
})
export class YieldLoveBlock1 {

    // yieldlove blocks
    block1Desktop: string;
    block1Mobile: string;
    block1Div: string;
    mainScript: string;

    @Input()
    mobile: boolean;

    constructor(private block1: Block1) {
        this.block1Desktop = block1.scriptDesktop
        this.block1Mobile = block1.scriptMobile
        this.block1Div = block1.divScript
      }

    ngOnInit() {
        if (this.mobile) {
            this.mainScript = this.block1Mobile
        } else {
            this.mainScript = this.block1Desktop
        }

    }
}
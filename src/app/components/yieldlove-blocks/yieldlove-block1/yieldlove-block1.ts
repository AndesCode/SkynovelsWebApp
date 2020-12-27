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
        console.log('se construye ad');
        console.log(this.block1Desktop);
        this.block1Desktop = block1.scriptDesktop
        this.block1Mobile = block1.scriptMobile
        this.block1Div = block1.divScript
      }

    ngOnInit() {
        console.log('se carga ad');
        if (this.mobile) {
            this.mainScript = this.block1Mobile
        } else {
            this.mainScript = this.block1Desktop
        }

    }
}
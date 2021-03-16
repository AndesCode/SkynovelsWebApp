import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Block7 } from 'src/app/config/yieldlove';

@Component({
    selector: 'ad-block7',
    templateUrl: './yieldlove-block7.html'
})
export class YieldLoveBlock7 {

    // yieldlove blocks
    block7Desktop: string;
    block7Mobile: string;
    block7Div: string;
    mainScript: string;
    mobile: boolean;
    constructor(private block7: Block7, private breakpointObserver: BreakpointObserver,) {
        this.block7Desktop = block7.scriptDesktop
        this.block7Mobile = block7.scriptMobile
      }

    ngOnInit() {

        this.breakpointObserver.observe('(max-width: 768px)').subscribe((state: BreakpointState) => {
            if (state.matches) {
              this.mobile = true;
            } else {
              this.mobile = false;
            }
        });
        if (this.mobile) {
            this.mainScript = this.block7Mobile
        } else {
            this.mainScript = this.block7Desktop
        }

    }
}
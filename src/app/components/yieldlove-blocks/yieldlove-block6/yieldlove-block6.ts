import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Block6 } from 'src/app/config/yieldlove';

@Component({
    selector: 'ad-block6',
    templateUrl: './yieldlove-block6.html'
})
export class YieldLoveBlock6 {

    // yieldlove blocks
    block6Desktop: string;
    block6Mobile: string;
    block6Div: string;
    mainScript: string;
    mobile: boolean;
    constructor(private block6: Block6, private breakpointObserver: BreakpointObserver,) {
        this.block6Desktop = block6.scriptDesktop
        this.block6Mobile = block6.scriptMobile
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
            this.mainScript = this.block6Mobile
        } else {
            this.mainScript = this.block6Desktop
        }

    }
}
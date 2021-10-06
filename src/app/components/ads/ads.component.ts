import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, isDevMode, OnInit } from '@angular/core';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {
  mobile: boolean;
  adBlock1 = false
  adBlock2 = false

  constructor(private breakpointObserver: BreakpointObserver,) { }

  ngOnInit(): void {
    if (!isDevMode()) {
      this.breakpointObserver.observe('(max-width: 500px)').subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobile = true;
        } else {
          this.mobile = false;
        }
      });
      if (Math.random() >= 0.5) {
        this.adBlock1 = true
      } else {
        this.adBlock2 = true
      }
    } else {
      return;
    }
  }

}

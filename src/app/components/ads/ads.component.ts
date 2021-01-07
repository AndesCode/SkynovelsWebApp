import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {
  mobile: boolean;

  constructor(private breakpointObserver: BreakpointObserver,) { }

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 500px)').subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    });
  }

}

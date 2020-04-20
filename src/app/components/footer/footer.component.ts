import { Component, OnInit } from '@angular/core';
import { BreakpointObserver,BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  
  mobile: boolean;

  constructor(public breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver
    .observe('(max-width: 679px)')
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.mobile = true;
        console.log(this.mobile);
      } else {
        this.mobile = false;
      }
    });
  }

}

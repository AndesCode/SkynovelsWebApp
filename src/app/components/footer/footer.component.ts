import { Component, OnInit } from '@angular/core';
import { BreakpointObserver,BreakpointState } from '@angular/cdk/layout';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  mobile: boolean;
  year: number;

  constructor(public breakpointObserver: BreakpointObserver,
              private hs: HelperService) { }

  ngOnInit(): void {
    this.year = this.hs.getCurrentYear();
    this.breakpointObserver.observe('(max-width: 449px)').subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.mobile = true;
        console.log(this.mobile);
      } else {
        this.mobile = false;
      }
    });
  }

}

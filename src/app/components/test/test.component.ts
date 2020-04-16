import { Component, AfterViewInit, OnDestroy, ElementRef, Renderer2, ViewChild, QueryList, ViewChildren  } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mainpanel') mainpanelRef: ElementRef;

  selector = '.main-panel';
  users = [];
  allUsers = [];
  currentPageDown = 9;
  currentPageUp = 9;
  currentUser = null;
  nextUser = null;
  elementsArray = [];
  loading = false;
  currentScroll = 0;

  @ViewChildren('test') panes;


  constructor(private as: AdminService,
              private renderer: Renderer2,
              private location: Location) {}

  ngAfterViewInit(): void {
    this.as.adminGetUsers('All').subscribe((data: any) => {
      this.allUsers = data.users;
      this.users.push(this.allUsers[this.currentPageUp]);
      this.currentUser = this.allUsers[this.currentPageUp];
      this.allUsers[this.currentPageUp].visible = true;
      this.allUsers[this.currentPageUp].estilo = true;
    });
    this.renderer.listen(this.mainpanelRef.nativeElement, 'scroll', () => {
      this.panes.forEach(pan => {
        if (pan.nativeElement.getBoundingClientRect().top < 350 && pan.nativeElement.getBoundingClientRect().bottom > 450) {
          console.log('current user: ' + pan.nativeElement.firstElementChild.firstElementChild.innerText + ' con id: '
          + pan.nativeElement.firstElementChild.lastElementChild.innerText);
        }
      });
    });
  }

  ngOnDestroy() {
    console.log('rompo bucle');
    this.mainpanelRef.nativeElement.scrollTop = 1;
  }

  checkElementIsCurrent(element: HTMLElement, event: any, user: any) {
    console.log(element);
    if (element.getBoundingClientRect().top < 350 && element.getBoundingClientRect().bottom > 450) {
      console.log('current user: ' + user.user_login + ' con id: '
      + user.id);
    }
  }

  onScrollDown(event) {
    if (event.visible) {
      this.currentPageDown = this.currentPageDown + 1;
      if (this.allUsers[this.currentPageDown]) {
        console.log('agregar adelante' + this.currentPageDown);
        this.users.push(this.allUsers[this.currentPageDown]);
      } else {
        return;
      }
    }
  }

  /*checkElementVisibility(element: HTMLElement, event) {
    console.log(element.getBoundingClientRect().top);
  }*/
    /*user.visible = event.visible;
    if (this.nextUser !== null) {
      if ((user.id !== this.currentUser.id && user.visible && !this.nextUser.visible)) {
        this.nextUser = user;
        console.log('next_user ' + this.nextUser.user_login);
      }
    } else {
      if ((user.id !== this.currentUser.id && user.visible)) {
        this.nextUser = user;
        console.log('super next_user ' + this.nextUser.user_login);
      }
    }
    if (this.currentUser.visible === false) {
      this.currentUser.estilo = false;
      this.currentUser = this.nextUser;
      // this.location.go('/test/' + this.currentUser.user_login);
      console.log('current_user ' + this.currentUser.user_login);
      this.currentUser.estilo = true;
    }
    // console.log('lee evento');
  }*/

  onScrollUp() {
    this.currentPageUp = this.currentPageUp - 1;
    if (this.allUsers[this.currentPageUp]) {
      console.log('agregar atras' + this.currentPageUp);
      this.users.unshift(this.allUsers[this.currentPageUp]);
    } else {
      return;
    }
  }
}

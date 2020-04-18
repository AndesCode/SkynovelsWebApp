import { Component, OnInit, EventEmitter, ElementRef, Renderer2, ViewChild, Directive } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { AdminService } from '../../../services/admin.service';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import { HelperService } from '../../../services/helper.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {


  currentComponent = null;
  forgot_password_form = false;
  loginButton = false;
  error: any = null;
  message: any = null;
  elementRotated = false;
  dropDown = false;
  user_invitations: any[] = [];
  user: any = {};
  mobile = false;
  show = false;
  mobileNavbar = false;

  constructor(public _auth: AuthService,
              public _us: UsersService,
              public _as: AdminService,
              private router: Router,
              private _hs: HelperService,
              private activatedRoute: ActivatedRoute,
              public breakpointObserver: BreakpointObserver,
              public el:ElementRef,
              public r: Renderer2) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Large = '(max-width: 1151px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobile = true;
          console.log('Estamos en movil');

        } else {
          this.mobile = false;
          this.closeMobileNavbarForm();
          console.log('El breakpoint no se cumple: ' + Breakpoints.Large);
        }
      });

    this._hs.sendCurrentComponnent.subscribe((data: any) => {
      this.currentComponent = data;
      console.log(this.currentComponent);
    });
    this._hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'closeSideNavBarCall') {
        this.mobileNavbar = false;
      }
    });
  }

  logout() {
    this._us.logOut().subscribe((data: any) => {
      localStorage.clear();
      if (this.currentComponent === 'MyNovelComponent'
      || this.currentComponent === 'MyNovelsComponent'
      || this.currentComponent === 'UserProfileComponent'
      || this.currentComponent === 'AdminPanelComponent') {
        this.router.navigate(['/home']);
      }
      this._hs.openExternalFunction('reloadUser');
    }, error => {
      localStorage.clear();
      this._hs.openExternalFunction('reloadUser');
    });
  }

  goToHome() {
    {
      this.router.navigate(['']);
      this.closeMobileNavbarForm();
    }{
      return;
    }
  }

  openLoginForm() {
    this._hs.openExternalFunction('loginForm');
  }

  openRegisterForm() {
    this._hs.openExternalFunction('registerForm');
  }

  openMobileNavbarForm() {
    this.mobileNavbar = true;
    this._hs.openExternalFunction('sideNavBar');
  }

  closeMobileNavbarForm() {
    this.mobileNavbar = false;
    this._hs.openExternalFunction('closeSideNavBar');
  }

  toggleTheme() {
    this._hs.openExternalFunction('toggleTheme');
  }

  /*showUserInvitations() {
    this._ns.showUserInvitations(this._auth.getUserLoged().jwt, this._auth.getUserLoged().user_id).subscribe((data: any) => {
      console.log(data.invitations);
      this.user_invitations = data.invitations;
      for (let i = 0; i < this.user_invitations.length; i++) {
        const datesDataFiltered = this._ns.getDiferenceInDaysBetweenDays(this.user_invitations[i].createdAt, null);
        this.user_invitations[i].creation_date = datesDataFiltered.creation_date;
      }
    }, error => {
      this._auth.errorHandler(error, 'login');
    });
  }*/

  /*acceptInvitation(invitation: any) {
    console.log('invitación aceptada');
    const user_novel = {
      novel_id: invitation.invitation_novel,
      user_id: this._auth.getUserLoged().user_id
    };
    invitation.invitation_status = 'Aprobada';
    this._ns.createNovelCollaborator(this._auth.getUserLoged().jwt, user_novel).subscribe((data: any) => {
      console.log(data);
      this._ns.updateUserInvitation(this._auth.getUserLoged().jwt, invitation).subscribe((invitations: any) => {
        console.log(invitations);
        this.showUserInvitations();
        const current_route = this.activatedRoute.snapshot['_routerState'].url;
        console.log(current_route);
        if (current_route === '/mis-novelas') {
          console.log('mis novelas detectado, ejecuta accion');
          this._ns.openExternalFunction('ReloadMyNovels');
        }
      });
    });
  }*/

  /*declineInvitation(invitation: any) {
    console.log('invitación declinada');
    invitation.invitation_status = 'Rechazada';
    this._ns.updateUserInvitation(this._auth.getUserLoged().jwt, invitation).subscribe((invitations: any) => {
      console.log(invitations);
      this.showUserInvitations();
    });
  }*/
}

import { Component, OnInit, EventEmitter, ElementRef, TemplateRef, Renderer2, ViewChild, Directive } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { AdminService } from '../../../services/admin.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { HelperService } from '../../../services/helper.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  @ViewChild('loginModal') loginModalRef: TemplateRef<any>;
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
  hide = true;
  mobileNavbar = false;
  currentForm = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;
  passwordRecoveryForm: FormGroup;
  loginFormLoading = false;

  // login
  registerCompleted = false;

  constructor(public _us: UsersService,
              public _as: AdminService,
              private router: Router,
              private _hs: HelperService,
              private activatedRoute: ActivatedRoute,
              public breakpointObserver: BreakpointObserver,
              public el:ElementRef,
              public r: Renderer2,
              public dialog: MatDialog) {

              this.loginForm = new FormGroup({
                user_login: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]),
                user_pass: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]),
              });

              this.registerForm = new FormGroup({
                user_login: new FormControl('', [Validators.required,
                                            Validators.pattern('^[a-zA-Z\u00d1\u00f1]{3}(?=.{2,12}$)(?![0-9])[a-zA-Z0-9\\u00d1\\u00f1]+$'),
                                            Validators.minLength(5), Validators.maxLength(12)]),
                user_email: new FormControl('', [Validators.required, Validators.email]),
                user_pass: new FormControl('', [Validators.required,
                                                Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z_.\\d]{8,16}$'),
                                                Validators.minLength(8), Validators.maxLength(16)]),
              });

              this.passwordRecoveryForm = new FormGroup({
                user_email: new FormControl('', [Validators.required, Validators.email])
              });
  }

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
      if (data === 'loginForm') {
        this.openDialogSheet(this.loginModalRef, true, false);
      }
      if (data === 'registerForm') {
        this.openDialogSheet(this.loginModalRef, false, true);
      }
    });
  }

  openDialogSheet(item: TemplateRef<any>, login?: boolean, register?: boolean): void {
    this.dialog.open(item);
    if (login) {
      this.currentForm = 'login';
    }
    if (register) {
      this.currentForm = 'register';
    }
  }

  login() {
    console.log(this.loginForm);
    this.loginFormLoading = true;
    if (this.loginForm.valid) {
      this._us.logIn(this.loginForm.value).subscribe((data: any) => {
        console.log(data);
        if (data.sknvl_s) {
          localStorage.setItem('sknvl_s', data.sknvl_s);
        }
        this._hs.openExternalFunction('reloadUser');
        this.dialog.closeAll();
        this.registerCompleted = false;
        this.loginFormLoading = false;
        this.loginForm.reset();
        // Acciones a tomar tras logearse en distintos componentes.
      }, error => {
        console.log(error);
        this.loginFormLoading = false;
        // this.displayMessage(error.error.message, true);
      });
    } else {
      // this.displayMessage('Debes escribir un usuario y contraseña', true);
    }
  }

  swichtTab(tab: string) {
    this.currentForm = tab;
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
      this.router.navigate(['']);
      this.closeMobileNavbarForm();
      return;
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

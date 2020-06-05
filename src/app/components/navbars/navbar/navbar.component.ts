import { Component, OnInit, EventEmitter, ElementRef, TemplateRef, Renderer2, ViewChild, Directive } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { AdminService } from '../../../services/admin.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { HelperService } from '../../../services/helper.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Invitation } from 'src/app/models/models';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  @ViewChild('loginModal') loginModalRef: TemplateRef<any>;
  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  currentComponent = null;
  loginButton = false;
  userInvitations: Array<Invitation> = [];
  mobile = false;
  hide = true;
  mobileNavbar = false;
  currentForm = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;
  passwordRecoveryForm: FormGroup;
  loginFormLoading = false;

  // login
  registerCompleted = false;

  constructor(public us: UsersService,
              public as: AdminService,
              private router: Router,
              private hs: HelperService,
              public matSnackBar: MatSnackBar,
              public breakpointObserver: BreakpointObserver,
              public el: ElementRef,
              private re: Renderer2,
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

        } else {
          this.mobile = false;
          this.closeMobileNavbarForm();
        }
      });

    this.hs.sendCurrentComponnent.subscribe((data: any) => {
      this.currentComponent = data;
      console.log(this.currentComponent);
    });
    this.hs.invokeExternalFunction.subscribe((data: any) => {
      if (data === 'closeSideNavBarCall') {
        this.mobileNavbar = false;
      }
      if (data === 'logOut') {
        this.logout();
      }
      if (data === 'loginForm') {
        this.openDialogSheet(this.loginModalRef, true, false);
      }
      if (data === 'registerForm') {
        this.openDialogSheet(this.loginModalRef, false, true);
      }
    });
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
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
      this.us.logIn(this.loginForm.value).subscribe((data: any) => {
        console.log(data);
        if (data.sknvl_s) {
          localStorage.setItem('sknvl_s', data.sknvl_s);
        }
        this.hs.openExternalFunction('reloadUser');
        this.dialog.closeAll();
        this.registerCompleted = false;
        this.loginFormLoading = false;
        this.loginForm.reset();
      }, error => {
        this.openMatSnackBar(this.errorSnackRef);
        this.errorSnackMessage = error.error.message;
        this.loginFormLoading = false;
      });
    } else {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Debes escribir un usuario y contraseña';
      this.loginFormLoading = false;
    }
  }

  swichtTab(tab: string) {
    this.currentForm = tab;
  }

  logout() {
    this.us.logOut().subscribe((data: any) => {
      localStorage.clear();
      if (this.currentComponent === 'UserNovelComponent'
      || this.currentComponent === 'UserNovelsComponent'
      || this.currentComponent === 'UserChapterComponent'
      || this.currentComponent === 'AdminPanelComponent') {
        this.router.navigate(['']);
      }
      this.hs.openExternalFunction('reloadUser');
    }, error => {
      localStorage.clear();
      if (this.currentComponent === 'UserNovelComponent'
      || this.currentComponent === 'UserNovelsComponent'
      || this.currentComponent === 'UserChapterComponent'
      || this.currentComponent === 'AdminPanelComponent') {
        this.router.navigate(['']);
      }
      this.hs.openExternalFunction('reloadUser');
    });
  }

  goToHome() {
      this.router.navigate(['']);
      this.closeMobileNavbarForm();
      return;
  }

  openMobileNavbarForm() {
    this.mobileNavbar = true;
    this.hs.openExternalFunction('sideNavBar');
  }

  closeMobileNavbarForm() {
    this.mobileNavbar = false;
    this.hs.openExternalFunction('closeSideNavBar');
  }

  toggleTheme() {
    this.hs.openExternalFunction('toggleTheme');
  }

  getUserInvitations() {
    this.us.getUserInvitations().subscribe((data: any) => {
      this.userInvitations = data.invitations;
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
      this.loginFormLoading = false;
    });
  }

  declineOrAcceptInvitation(invitation: Invitation, status: 'Confirmed' | 'Rejected') {
    invitation.invitation_status = status;
    this.us.updateUserInvitation(invitation).subscribe((data: any) => {
      this.userInvitations.splice(this.userInvitations.findIndex(x => x.id === invitation.id), 1);
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }
}

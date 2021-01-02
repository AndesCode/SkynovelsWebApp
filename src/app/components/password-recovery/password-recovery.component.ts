import { Component, OnInit, ViewChild, TemplateRef, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperService } from '../../services/helper.service';
import { isPlatformBrowser } from '@angular/common';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {

  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  loading = false;
  hide = true;
  passwordUpdated = false;
  UpdatePasswordForm: FormGroup;
  formLoading = false;
  urlToken: string;
  componentName = 'PasswordRecoveryComponent';
  isBrowser: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private us: UsersService,
              public ps: PageService,
              private hs: HelperService,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId) {

                this.isBrowser = isPlatformBrowser(this.platformId);
                this.UpdatePasswordForm = new FormGroup({
                  user_pass: new FormControl('', [Validators.required,
                    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$_\-!%*?&.,"'#{}()¡¿])[A-Za-z\d@$_\-!%*?&.,"'#{}()¡¿]{8,16}$/),
                    Validators.minLength(8), Validators.maxLength(16)]),
                  user_confirm_pass: new FormControl('')
                });
              }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.urlToken = String(this.activatedRoute.snapshot.paramMap.get('token'));
      this.hs.updateBrowserMeta('description', 'Restablecer contraseña', 'SkyNovels | Recuperación de contraseña');
      this.us.passwordResetAccess(this.urlToken).subscribe((data: any) => {
        this.loading = false;
      }, error => {
        this.router.navigate(['']);
      });
    } else {
      return;
    }
  }

  updatePassword() {
    this.formLoading = true;
    if (this.UpdatePasswordForm.valid && (this.UpdatePasswordForm.value.user_pass === this.UpdatePasswordForm.value.user_confirm_pass || !this.hide)) {
      this.us.updateUserPassword(this.UpdatePasswordForm.value.user_pass, this.urlToken).subscribe((data: any) => {
        this.passwordUpdated = true;
        this.formLoading = false;
        this.UpdatePasswordForm.reset();
      }, error => {
        this.ps.openMatSnackBar(this.errorSnackRef);
        this.errorSnackMessage = error.error.message;
        this.formLoading = false;
      });
    } else {
      this.ps.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Debes indicar una contraseña valida';
      this.formLoading = false;
    }
  }

}

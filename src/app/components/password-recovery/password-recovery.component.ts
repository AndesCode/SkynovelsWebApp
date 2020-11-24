import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {

  @ViewChild('loginModal') loginModalRef: TemplateRef<any>;
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

  constructor(private activatedRoute: ActivatedRoute,
              private us: UsersService,
              private router: Router,
              public matSnackBar: MatSnackBar) {

                this.UpdatePasswordForm = new FormGroup({
                  user_pass: new FormControl('', [Validators.required,
                    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,"'#{}()¡¿])[A-Za-z\d@$!%*?&.,"'#{}()¡¿]{8,16}$/),
                    Validators.minLength(8), Validators.maxLength(16)])
                });
              }

  ngOnInit(): void {
    this.urlToken = String(this.activatedRoute.snapshot.paramMap.get('token'));
    this.us.passwordResetAccess(this.urlToken).subscribe((data: any) => {
      this.loading = false;
    }, error => {
      // this.router.navigate(['']);
    });
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  updatePassword() {
    console.log(this.UpdatePasswordForm);
    this.formLoading = true;
    if (this.UpdatePasswordForm.valid) {
      this.us.updateUserPassword(this.UpdatePasswordForm.value.user_pass, this.urlToken).subscribe((data: any) => {
        this.passwordUpdated = true;
        console.log(data);
        this.formLoading = false;
        this.UpdatePasswordForm.reset();
      }, error => {
        this.openMatSnackBar(this.errorSnackRef);
        this.errorSnackMessage = error.error.message;
        this.formLoading = false;
      });
    } else {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = 'Debes indicar una contraseña valida';
      this.formLoading = false;
    }
  }

}
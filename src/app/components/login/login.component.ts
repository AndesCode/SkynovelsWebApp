import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  forgot_password_form = false;
  registerForm = false;
  loginButton = false;
  currentForm = 'login';
  message: any = null;
  isError = false;
  user_invitations: any[] = [];
  currentComponent: any = null;
  user: any = {};
  registerCompleted = false;

  constructor(public _auth: AuthService,
    private _ls: LoginService,
    private _hs: HelperService,
    private _router: Router,
    private _us: UsersService) { }

  ngOnInit(): void {
    /* Se subscribe al emisor invokeExternalFunction (Si la emisión recibida contiene el dato en forma de string 'loginForm'
    * ejecuta la función
    */
      this._hs.invokeExternalFunction.subscribe((data: any) => {
        if (data === 'loginForm') {
          this.loginbutton();
        }
        if (data === 'registerForm') {
          this.loginbutton();
          this.currentForm = 'register';
        }
      });
    /* Se subscribe al emisor sendCurrentComponnent y recibe el componente actual en el que se mueve la aplicación
    * desde el router-outlet
    */
      this._hs.sendCurrentComponnent.subscribe((data: any) => {
        this.currentComponent = data;
        console.log(this.currentComponent);
      });
  }

  login(loginForm: NgForm) {
        console.log('NgForm', loginForm);
        console.log(loginForm.value);
        if (loginForm.form.valid) {
          this._us.logIn(this.user).subscribe((data: any) => {
            console.log(data);
            if (data.sknvl_s) {
              localStorage.setItem('sknvl_s', data.sknvl_s);
            }
            this._hs.openExternalFunction('reloadUser');
            this.closeLoginForm();
            this.registerCompleted = false;
            // Acciones a tomar tras logearse en distintos componentes.
          }, error => {
            this.displayMessage(error.error.message, true);
          });
        } else {
          this.displayMessage('Debes escribir un usuario y contraseña', true);
        }
  }

  register(registerForm: NgForm) {
    const pass = registerForm.value.user_pass;
    const confirmPass = registerForm.value.user_confirm_pass;
    if (registerForm.form.valid) {
      if (pass === confirmPass) {
        this._ls.userRegister(this.user).subscribe((data: any) => {
          console.log(data);
          console.log('usuario registrado correctamente');
          this.message = null;
          this.registerCompleted = true;
        });
      } else {
        this.displayMessage('La contraseña y su confirmación no coinciden', true);
        return;
      }
    } else {
      console.log('formulario invalido');
        this.displayMessage('Debes rellenar todos los campos correctamente', true);
        return;
    }
  }

  /*passwordResetRequest(forggotPasswordForm: NgForm) {
    console.log('NgForm', forggotPasswordForm);
    console.log(forggotPasswordForm.value);
    this._ns.getPasswordResetRequest(forggotPasswordForm.value).subscribe((dataUser: any) => {
      console.log(dataUser.message);
      this.displayMessage(dataUser.message, false);
    }, error => {
      console.log(error.error.message);
      this.displayMessage(error.error.message, true);
    });
  }*/

  displayMessage(message: string, error: boolean) {
    this.message = message;
    this.isError = error;
  }



  change_form(form) {
    this.user = {};
    this.currentForm = form;
    this.message = null;
    this.focusInput('login');
  }

  loginbutton() {
    this.loginButton = true;
    this.focusInput('login');
  }

  focusInput(input: string) {
      setTimeout(() => {
        const element = <HTMLInputElement> document.getElementById(input);
        if (element) { element.focus(); }
      }, 1);
  }

  closeLoginForm() {
    this.forgot_password_form = false;
    this.loginButton = false;
    this.change_form('login');
  }
}

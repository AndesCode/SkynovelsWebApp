import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _ns: AppService) { }

  /**
  * Obitiene el usuario logeado a traves de datos dentro del JWT guardado en el LocalStorage. Si no hay datos, retorna vacio
  */
  getUserLoged() {
    const user = new User();
    if (this.getToken()) {
      const jwt = this.getToken();
      const jwtData = jwt.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      user.user_id = decodedJwtData.sub;
      user.user_rol = decodedJwtData.user_rol;
      user.jwt = jwt;
      return user;
    } else {
      user.user_id = null;
      user.user_rol = null;
      user.jwt = null;
      return user;
    }
  }

  /*getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity_user'));
    if (identity) {
      return identity;
    } else {
      return null;
    }
  }*/

  /**
  * Devuelve un true si encuentra datos en token del LocalStorage
  */
  userIsLoged() {
    const identity = localStorage.getItem('token');
    if (identity) {
      return true;
    } else {
      return false;
    }
  }

  /**
  * devuelve el JWT leido del LocalStorage
  */
  getToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      return null;
    }
  }

  userIsAdmin() {
    if (this.getToken()) {
       const user = this.getUserLoged();
       if (user.user_rol === 'admin') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  novelEditionAuthorization(novel_author: any, novel_collaborators: Array<any>, user_id) {
    const user_permission = {
      authorized: false,
      denomination: ''

    };
    if (user_id === novel_author) {
      user_permission.authorized = true;
      user_permission.denomination = 'author';
      return user_permission;
    } else {
      if (novel_collaborators.includes(user_id)) {
        user_permission.authorized = true;
        user_permission.denomination = 'collaborator';
        return user_permission;
      } else {
        return false;
      }
    }
  }

  /**
  * Acciones a tomar según el codigo de error devuelto desde la API Rest.
    * @param error Error devuelto desde la API Rest (error.status: status del error devuelto).
    * @param action Acción a tomar por string.
  */
  errorHandler(error: any, action: any) {
    console.log(error);
    console.log(action);
    if (error.status === 401) {
      if (action === 'login') {
        this._ns.openExternalFunction('loginForm');
      }
      if (action === 'logout') {
        this.logOut();
        console.log('Error Unauthorized se deslogea el usuario');
      }
    }
    if (error.status === 500) {
      return error.error.message;
    }
    if (action === 'instant_logout') {
      this.logOut();
      this._ns.openExternalFunction('loginForm');
    }
  }

  logOut() {
    localStorage.removeItem('identity_user');
    localStorage.clear();
  }
}

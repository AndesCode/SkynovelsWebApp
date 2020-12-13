import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { UsersService } from './users.service';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private router: Router,
              private us: UsersService,
              private as: AdminService) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if (
      route.routeConfig.path === 'panel'
      || route.routeConfig.path === 'panel/administracion-de-novelas'
      || route.routeConfig.path === 'panel/administracion-de-novelas/:id'
      || route.routeConfig.path === 'panel/administracion-de-usuarios'
      || route.routeConfig.path === 'panel/administracion-de-usuarios/:id'
      ) {
      if (this.as.userIsAdmin()) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    } else if (
      route.routeConfig.path === 'registrarse'
      ) {
      if (!this.us.userIsLoged()) {
        // this._ns.openExternalFunction('registerForm');
        this.router.navigate(['']);
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    } else if (
      route.routeConfig.path === 'mi-perfil'
      || route.routeConfig.path === 'mis-novelas'
      || route.routeConfig.path === 'lista-de-lectura'
      || route.routeConfig.path === 'mi-novela/:id'
      ) {
      if (this.us.userIsLoged()) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    } else {
      return true;
    }
  }
}

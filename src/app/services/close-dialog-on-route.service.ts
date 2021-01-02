import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { first, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { PageService } from './page.service';

@Injectable({
  providedIn: 'root'
})

export class CloseDialogOnRouteService implements CanDeactivate<any> {
  constructor(private dialog: MatDialog,
              private readonly location: Location,
              private readonly router: Router,
              private ps: PageService) { }

  canDeactivate(_: any, currentRoute: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.dialog.openDialogs.length === 0 && !this.ps.getBottomSheetState()) {
      return true;
    }
  
    this.dialog.closeAll();
    this.ps.bottomSheetDismiss();
    return this.dialog.afterAllClosed.pipe(first(), map(() => {
      const currentUrlTree = this.router.createUrlTree([], currentRoute);
      const currentUrl = currentUrlTree.toString();
      this.location.go(currentUrl);
      return false;
    }));
  }
}

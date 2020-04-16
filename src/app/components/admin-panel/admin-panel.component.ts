import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from '../../services/admin.service';
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              public _router: Router,
              private _us: UsersService,
              private _as: AdminService,
              private _auth: AuthService) { }
  adminVerificated = false;
  currentView = 'panel';
  ngOnInit(): void {
    // Verificando administrador
    this._as.adminPanelAccess(this._us.getUserLoged().token).subscribe((data: any) => {
      console.log(data);
      if (data.status === 200) {
        this.adminVerificated = true;
      } else {
        this._router.navigate(['/home']);
        this._as.adminPanelErrorHandler(null, true);
      }
    }, error => {
      console.log(error);
      this._router.navigate(['/home']);
      this._as.adminPanelErrorHandler(error, false);
    });
  }

  switchView(view: string) {

  }

}

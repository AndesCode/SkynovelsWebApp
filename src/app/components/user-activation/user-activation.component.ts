import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.scss']
})
export class UserActivationComponent implements OnInit {

  loading = true;
  userActivated: string;
  componentName = 'UserActivationComponent';
  isBrowser: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private us: UsersService,
              private router: Router,
              private hs: HelperService,
              @Inject(PLATFORM_ID) private platformId) { 
                this.isBrowser = isPlatformBrowser(this.platformId);
              }

  ngOnInit(): void {
    if (this.isBrowser) {
      const urlKey = String(this.activatedRoute.snapshot.paramMap.get('key'));
      this.us.activateUser(urlKey).subscribe((data: any) => {
        this.loading = false;
        this.userActivated = data.user_login;
        this.hs.updateBrowserMeta('description', 'Activación y verificación de usuario', 'SkyNovels | ¡Asciende a Mundos Increíbles!');
      }, error => {
        console.log(error);
        this.router.navigate(['']);
      });
    } else {
      return;
    }
  }

}

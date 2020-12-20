import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.scss']
})
export class UserActivationComponent implements OnInit {

  loading = true;
  userActivated: string;
  componentName = 'UserActivationComponent';

  constructor(private activatedRoute: ActivatedRoute,
              private us: UsersService,
              private router: Router,
              private hs: HelperService) { }

  ngOnInit(): void {
    const urlKey = String(this.activatedRoute.snapshot.paramMap.get('key'));
    this.us.activateUser(urlKey).subscribe((data: any) => {
      this.loading = false;
      this.userActivated = data.user_login;
      this.hs.updateBrowserMeta('description', 'Activación y verificación de usuario', 'SkyNovels | ¡Asciende a Mundos Increíbles!');
    }, error => {
      console.log(error);
      this.router.navigate(['']);
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { PageService } from 'src/app/services/page.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  userNotifications: Array<any> = [];
  loading = true;

  constructor(private us: UsersService,
    private router: Router,
    public ps: PageService,
    public hs: HelperService) { }

  ngOnInit(): void {
    this.hs.updateBrowserMeta('description', 'Notificaciones de usuario', 'SkyNovels | Notificaciones');
      this.us.getUserNotifications(false).subscribe((data: any) => {
      this.userNotifications = data.notifications;
      this.loading = false;
    }, error => {
      console.log(error)
      // this.router.navigate(['']);
    });
  }

}

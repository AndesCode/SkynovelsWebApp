import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

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
              private router: Router) { }

  ngOnInit(): void {
    const urlKey = String(this.activatedRoute.snapshot.paramMap.get('key'));
    this.us.activateUser(urlKey).subscribe((data: any) => {
      this.loading = false;
      this.userActivated = data.user_login;
    }, error => {
      this.router.navigate(['']);
    });
  }

}

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Invitation } from '../../models/models';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent implements OnInit {

  userInvitations: Array<Invitation> = [];
  @ViewChild('successSnack') successSnackRef: TemplateRef<any>;
  @ViewChild('errorSnack') errorSnackRef: TemplateRef<any>;
  public successSnackMessage: string;
  public errorSnackMessage: string;
  loading = true;

  constructor(private us: UsersService,
              private router: Router,
              public matSnackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.us.getUserInvitations().subscribe((data: any) => {
      this.userInvitations = data.invitations;
      this.loading = false;
    }, error => {
      this.router.navigate(['novelas']);
    });
  }

  openMatSnackBar(template: TemplateRef<any>): void {
    this.matSnackBar.openFromTemplate(template, { duration: 2000, verticalPosition: 'top'});
  }

  declineOrAcceptInvitation(invitation: Invitation, status: 'Confirmed' | 'Rejected') {
    invitation.invitation_status = status;
    this.us.updateUserInvitation(invitation).subscribe((data: any) => {
      this.userInvitations.splice(this.userInvitations.findIndex(x => x.id === invitation.id), 1);
    }, error => {
      this.openMatSnackBar(this.errorSnackRef);
      this.errorSnackMessage = error.error.message;
    });
  }

}

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Profile } from '@phantom-chen/cloud77';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { UnAuthorizedComponent } from '../un-authorized/un-authorized.component';
import { AccountService } from '../account.service';
import { SharedModule } from '@shared/shared.module';
import { SNACKBAR_DURATION } from '@shared/utils';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    UnAuthorizedComponent,
    SharedModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {

  constructor(
    @Inject('AccountService') private service: AccountService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog) { }

  loading = true;
  isLogin = false;

  email = '';
  name = '';

  confirmed = false;
  profile: Profile = {
    surname: '',
    givenName: '',
    company: '',
    companyType: '',
    city: '',
    title: '',
    phone: '',
    contact: '',
    fax: '',
    post: '',
    supplier: ''
  };

  preview = '';

  ngOnInit(): void {
    // this.gateway.ping().then((data: string) => {
    //   console.log('Gateway ping response:', data);
    // }).catch((error: any) => {
    //   this.snackbar.open('Error', 'Fail to connect to service', { duration: SNACKBAR_DURATION });
    // });
    this.service.gateway.loginSession$.subscribe({
      next: res => {
        // the token is valid, user name is saved in session storage
        this.loading = false;

        if (res.expiration) {
          console.warn('No email found in session storage');
          this.email = sessionStorage.getItem('user_email') || '';
          this.isLogin = true;
          this.service.getAccountInfo().subscribe({
            next: data => {
              this.name = data.name;
              this.confirmed = data.confirmed;
              this.profile = data.profile;
              this.preview = JSON.stringify(data, undefined, 2);
            }
          });
        }
      }
    });

    this.service.gateway.validateToken();
  }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  createProfile(): void {
    this.updateProfile();
    // this.snackbar.open('Info', 'Already submit your profile', { duration: SNACKBAR_DURATION });
    // this.snackbar.open('Error', 'Fail to submit your profile', { duration: SNACKBAR_DURATION });
  }

  updateProfile(): void {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '800px',
      data: Object.assign({}, this.profile)
    });

    dialogRef.afterClosed().subscribe((result: Profile) => {
      console.log(result);
      this.snackbar.open('Info', 'WIP', { duration: SNACKBAR_DURATION });
      if (result) {
        this.service.updateProfile(result);
      }
    });
  }

  sendConfirmationEmail(): void {
    this.snackbar.open('Info', 'Mock up: Already send email to you', { duration: SNACKBAR_DURATION });
    this.service.verifyEmail().subscribe(res => console.log(res));
  }

  deleteProfile(): void {
    this.snackbar.open('Info', 'Mock up: Already delete your profile', { duration: SNACKBAR_DURATION });
  }
}

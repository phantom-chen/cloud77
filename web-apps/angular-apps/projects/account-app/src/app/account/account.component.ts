import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Profile, UserAccount } from '@phantom-chen/cloud77';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { SNACKBAR_DURATION } from '../service';
import { UnAuthorizedComponent } from '../un-authorized/un-authorized.component';
import { getTokens, getUserEmail } from '../../../../../src/app/shared';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
    UnAuthorizedComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit, AfterViewInit {

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private san: DomSanitizer,
    private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    window.addEventListener('message', function (ev) {
      if (ev.data) {
        if (ev.data.name === 'login_ready' && localStorage.getItem('cloud77_sso')) {
          window.location.href = localStorage.getItem('cloud77_sso') || '';
        }
      }
    });
  }

  isLogin = false;
  email = '';
  name = '';
  role = '';
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

  @ViewChild("messageContainer")
  messageContainer!: ElementRef<HTMLIFrameElement>;

  frameResourceUrl?: SafeResourceUrl;

  ngOnInit(): void {
    const tokens = getTokens();
    if (tokens.access) {
      this.email = sessionStorage.getItem('user_email') || '';
      if (this.email) {
        // the token is valid, user name is saved in session storage
        this.isLogin = true;
        this.http.get(`/user-api/accounts/${this.email}`).subscribe((data: any) => {
          console.log(data);
          this.name = data.name;
          this.role = data.role;
          this.confirmed = data.confirmed;
          this.profile = data.profile;
        });
      } else {
        this.http.get('/user-api/accounts/role').subscribe((data: any) => {
          console.log(data);
          // this.name = data.name;
          // this.role = data.role;
          // this.confirmed = data.confirmed;
          // this.profile = data.profile;
        });
        console.warn('No email found in session storage');
      }
    }
    else {
      console.warn('No tokens found in session storage');
    }
  }

  getUserEmail(): void {
    
  }

  getAccount(): void {

  }

  onSSO(): void {
    const ssoUrl = localStorage.getItem('cloud77_sso') || '';
    if (ssoUrl) {
      this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(`${ssoUrl}/message`);

      setTimeout(() => {
        this.messageContainer.nativeElement.contentWindow?.postMessage({
          name: "request_login",
          host: window.location.host,
          message: `${window.location.protocol}//${window.location.host}/message`,
          url: window.location.href,
        }, '*');
      }, 1000);
    }
  }

  updateProfile(): void {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '800px',
      data: Object.assign({}, this.profile)
    });

    dialogRef.afterClosed().subscribe((result: Profile) => {
      console.log(result);
      this.snackbar.open('Info', 'WIP', { duration: SNACKBAR_DURATION });
    });
  }
}

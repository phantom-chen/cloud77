import { AfterViewInit, Component } from '@angular/core';
import { GatewayService } from '../../gateway.service';
import { Profile, UserAccount } from '@phantom-chen/cloud77';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';

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
    MatSnackBarModule,
    MatDialogModule,
    ProfileDialogComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements AfterViewInit {

  email = '';
  name = '';
  role = '';
  foundProfile = false;
  showProfile = false;
  confirmed = false;
  account: UserAccount | undefined;
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

  constructor(
    private service: GatewayService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog) {}

  ngAfterViewInit(): void {
    console.log('account component');
    const email = localStorage.getItem('remember');
    if (email) {
      console.log(email);
      this.service.getAccount(email).then(res => {
        console.log(res);
        if (res) {
          this.email = res.email;
          this.name = res.name;
          this.foundProfile = res.existing;
          this.confirmed = res.confirmed;
          this.account = res;
          this.profile = res.profile;
        }
      });
    }
  }

  createProfile() {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '800px',
      data: Object.assign({}, this.profile)
    });

    dialogRef.afterClosed().subscribe((result: Profile) => {
      console.log(result);
      // if (result) {
      //   this.service.postProfile({
      //     email: this.email,
      //     surname: result.surname,
      //     givenName: result.givenName,
      //     company: result.company,
      //     companyType: result.companyType,
      //     city: result.city,
      //     phone: result.phone,
      //     contact: result.contact,
      //     title: result.title,
      //     fax: result.fax,
      //     post: result.post,
      //     supplier: result.supplier
      //   }).then(res => {
      //     this.snackbar.open('Info', 'Already submit your profile', { duration: SNACKBAR_DURATION });
      //     this.foundProfile = true;
      //   }, err => {
      //     this.snackbar.open('Error', 'Fail to submit your profile', { duration: SNACKBAR_DURATION });
      //   }).finally(() => {
      //     setTimeout(() => {

      //     }, 2000);
      //   });
      // }
    });
  }
}

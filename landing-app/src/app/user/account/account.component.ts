import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Profile, UserAccount } from '@phantom-chen/cloud77';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';

const SNACKBAR_DURATION = 3000;

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
    MatSnackBarModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private dialog: MatDialog) {}
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
  ngOnInit(): void {
    this.email = sessionStorage.getItem('email') ?? '';
    if (this.email) {
      this.isLogin = true;
      this.http.get(`/api/accounts/${this.email}`).subscribe((data: any) => {
        console.log(data);
        this.name = data.name;
        this.role = data.role;
        this.confirmed = data.confirmed;
        this.profile = data.profile;
      });
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

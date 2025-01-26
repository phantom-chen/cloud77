import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCommonModule } from '@angular/material/core';
import { MatCardModule } from "@angular/material/card";
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SNACKBAR_DURATION } from '../../gateway.service';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
  constructor(
    private snackbar: MatSnackBar,
    private router: Router
  ) {}


  email: string = '';
  password: string = '';
  newPassword: string = '';
  newPasswordAgain: string = '';

  emailConfirm = '';
  disableDelete = true;

  onEmailChange() {
    this.disableDelete = this.emailConfirm.toLowerCase().length  < 6;
    console.warn('enable when email length is greater than 6');
  }

  updatePassword() {
    this.snackbar.open('Info', 'Password is updated, please login again.', { duration: SNACKBAR_DURATION })
    console.log("remove session storage");
    console.log('go to login page');
    setTimeout(() => {
      this.router.navigate(['/']);
    }, SNACKBAR_DURATION + 1000);
  }

  delete() {
    console.log('wip');
    this.snackbar.open('Info', 'Mock Delete account (profile, tasks)', { duration: SNACKBAR_DURATION });
    setTimeout(() => {
      this.router.navigate(['/']);
    }, SNACKBAR_DURATION + 1000);
  }
}

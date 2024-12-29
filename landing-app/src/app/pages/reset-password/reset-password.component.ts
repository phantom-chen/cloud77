import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    PasswordStrengthMeterComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  
  constructor(
    private http: HttpClient
  ) {}
  
  email = '';
  token = '';
  password = '';
  confirmPassword = '';

  sendToken(): void {
    if (this.email) {
      this.http.post(`/api/users/password-token?email=${this.email}`, {})
        .subscribe((data: any) => {
          console.log(data);
        });
    }
  }

  resetPassword(): void {
    if (this.email && this.password && this.token) {
      this.http.put('/api/users/password', {
        email: this.email,
        password: this.password,
      }, {
        headers: {
          'x-cloud77-onetime-token': this.token
        }
      }).subscribe((data: any) => {
        console.log(data);
      });
    } else {
      // Show error message
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    PasswordStrengthMeterComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  constructor(
    private http: HttpClient
  ) {}

  email = '';
  name = '';
  password = '';

  signUp(): void {
    if (this.email && this.name && this.password) {
      this.http.post('/api/users', {
        email: this.email,
        name: this.name,
        password: this.password
      }).subscribe((data: any) => {
        console.log(data);
      });
    }
  }
}

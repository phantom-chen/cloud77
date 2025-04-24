import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';
import { MatIconModule } from '@angular/material/icon';
import { IGatewayService } from '../service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatIconModule,
    PasswordStrengthMeterComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  constructor(
    @Inject('IGatewayService') private gateway: IGatewayService,
    private snackbar: MatSnackBar,
  ) {}

  email = '';
  name = '';
  password = '';

  signUp(): void {
    if (this.email && this.name && this.password) {
      this.gateway.createUser(this.email, this.name, this.password)
      .then(res => {
        console.log(res);
        this.snackbar.open('Info', res.message, {duration: 3000});
      })
    }
  }
}

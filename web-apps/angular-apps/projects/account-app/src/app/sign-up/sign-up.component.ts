import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
export class SignUpComponent implements OnInit {

  constructor(
    @Inject('IGatewayService') private gateway: IGatewayService,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    document.title = 'Sign Up';
  }

  email = '';
  name = '';
  password = '';

  emailExisting = true;
  nameExisting = true;

  onEmailChange(): void {
    this.gateway.getUser(this.email, '')
    .then(res => {
      this.emailExisting = res.existing;
      if (res.existing) {
        this.snackbar.open('Info', 'Email / Name already exists', {duration: 3000});
      }
    })
  }

  onNameChange(): void {
    this.gateway.getUser('', this.name)
    .then(res => {
      this.nameExisting = res.existing;
      if (res.existing) {
        this.snackbar.open('Info', 'Email / Name already exists', {duration: 3000});
      }
    })
  }

  signUp(): void {
    if (this.emailExisting || this.nameExisting) {
      this.snackbar.open('Info', 'Email already exists', {duration: 3000});
      return;
    }

    // format email
    // format name
    // check password strength
    if (this.email && this.name && this.password) {
      this.gateway.createUser(this.email, this.name, this.password)
      .then(res => {
        console.log(res);
        this.snackbar.open('Info', res.message, {duration: 3000});
      })
    }
  }
}

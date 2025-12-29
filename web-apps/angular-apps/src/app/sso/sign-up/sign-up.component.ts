import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';
import { UserService } from '../sso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    PasswordStrengthMeterComponent,
  ],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.css",
})
export class SignUpComponent implements OnInit {
  constructor(
    @Inject("UserService") private service: UserService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  email = "";
  name = "";
  password = "";
  emailExisting = true;
  nameExisting = true;

  ngOnInit(): void {
    document.title = "Sign Up";
  }

  onEmailChange(): void {
    // check if email is valid format
    // check if email is registered

    this.service.getUser(this.email, "").subscribe((res) => {
      this.emailExisting = res.existing;
      if (res.existing) {
        this.snackbar.open("Info", "Email / Name already exists", {
          duration: 3000,
        });
      }
    });
  }

  onNameChange(): void {
    // check if name is used
    this.service.getUser("", this.name).subscribe((res) => {
      this.nameExisting = res.existing;
      if (res.existing) {
        this.snackbar.open("Info", "Email / Name already exists", {
          duration: 3000,
        });
      }
    });
  }

  signUp(): void {
    // format email
    // format name
    // check password strength

    if (this.emailExisting || this.nameExisting) {
      this.snackbar.open('Info', 'Email already exists', {duration: 3000});
      return;
    }

    // check password complexity

    this.service
      .createUser(this.email, this.name, this.password)
      .subscribe((res) => {
        localStorage.setItem("user_email", this.email);
        localStorage.removeItem("user_access_token");
        localStorage.removeItem("user_refresh_token");

        console.log("User created:", res);
        this.email = "";
        this.name = "";
        this.password = "";

        const ref = this.snackbar.open("User created successfully", "Close", {
          duration: 3000,
        });
        ref.onAction().subscribe(() => {
          this.router.navigateByUrl("/sso");
        });
      });
  }
}

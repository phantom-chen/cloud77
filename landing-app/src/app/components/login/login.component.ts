import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GatewayService } from '../../gateway.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCommonModule } from '@angular/material/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {

  remember: boolean = false;
  account: string = '';
  password: string = '';
  constructor(private service: GatewayService) {}
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    this.service.ping();
    this.service.testing();
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.type === 'keyup' && event.key === 'Enter') {
      this.login();
    }
  }

  login(): void {
    console.log('login works')
    this.service.testing();
    console.log(this.remember);
    console.log(this.account);
    console.log(this.password);

    this.service.getToken({
      email: this.account.includes('@') ? this.account.toLowerCase() : undefined,
      name: this.account.includes('@') ? undefined : this.account.toLowerCase(),
      password: this.password
    }).then(res => {
      console.log(res);
      localStorage.setItem('accessToken', res.value);
      localStorage.setItem('refreshToken', res.refreshToken);
      if (this.remember) {
        localStorage.setItem('remember', res.email || '');
      } else {
        localStorage.removeItem('remember');
      }
    })
  }

  onAccountChange(): void {
    console.log('account changed')
  }

  forgetPassword(): void {
    console.log('forget password works')
  }
}

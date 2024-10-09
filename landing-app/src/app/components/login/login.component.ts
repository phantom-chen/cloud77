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
    this.service.ping();
  }

  onAccountChange(): void {
    console.log('account changed')
  }

  forgetPassword(): void {
    console.log('forget password works')
  }
}

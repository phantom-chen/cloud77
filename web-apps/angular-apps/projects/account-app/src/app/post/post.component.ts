import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../account.service';
import { MatCommonModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { UnAuthorizedComponent } from '../un-authorized/un-authorized.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatChipsModule,
    MatButtonModule,
    UnAuthorizedComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {

  constructor(
    @Inject('AccountService') private service: AccountService
  ) {

  }

  ngOnInit(): void {
    this.service.gateway.loginSession$.subscribe({
      next: res => {
        this.loading = false;
        if (res.expiration) {
          this.isLogin = true;
        }
      }
    });
    this.service.gateway.validateToken();
  }

  loading: boolean = true;
  isLogin: boolean = false;

  tags = ['angular', 'react', 'docker'];
  themes = ["vs", "vs-dark", "hc-black"];

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }
}

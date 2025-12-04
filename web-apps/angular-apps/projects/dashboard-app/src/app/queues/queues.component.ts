import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DashboardService } from '../dashboard.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-queues',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './queues.component.html',
  styleUrl: './queues.component.css'
})
export class QueuesComponent implements OnInit {

  constructor(
    @Inject('DashboardService') private service: DashboardService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.service.gateway.loginSession$.subscribe(res => {
      this.loading = false;
      if (res.expiration) {
        this.isLogin = true;
      }
    });

    this.service.gateway.validateToken();
  }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  message: string = "";
  email = '';
  subject = '';
  body = '';

  loading = true;
  isLogin = false;

  sendMessage(): void {
    if (this.message) {
      console.log('wip');
      console.log(this.message);
      this.http.post(`/api/super/queues?message=${this.message}`, undefined).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {

        }
      });
    } else {
      alert('empty message');
    }
  }

  sendMail(): void {
    console.log('wip');
    this.http.post('/api/super/queues/mails', {
      subject: this.subject,
      body: this.body,
      addresses: [this.email],
      isBodyHtml: false
    }).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {

        }
      });
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTabsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    private http: HttpClient,
    @Inject('DashboardService') private service: DashboardService) { }

  loading = true;
  isLogin = false;

  databases: string[] = [];
  collections: string[] = [];
  database: string = '';
  email: string = '';
  health: string[] = [];
  cacheKey = '';
  cacheValue = '';
  cacheErrorMessage = '';

  ngOnInit(): void {
    this.service.gateway.loginSession$.subscribe(res => {
      this.loading = false;
      if (res.expiration) {
        this.isLogin = true;
      }
    })

    this.service.gateway.validateToken();
  }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  getHealth(): void {
    this.health = [];

    this.http.get('/api/health', { responseType: 'text' }).subscribe((data: any) => {
      this.health.push(`Gateway: ${data}`);
    });
    this.http.get('/api/sample/health', { responseType: 'text' }).subscribe((data: any) => {
      this.health.push(`Sample Service: ${data}`);
    });
    this.http.get('/api/user/health', { responseType: 'text' }).subscribe((data: any) => {
      this.health.push(`User Service: ${data}`);
    });
    this.http.get('/api/super/health', { responseType: 'text' }).subscribe((data: any) => {
      this.health.push(`Super Service: ${data}`);
    });
  }

  getAgent(): void {
    this.http.get('/api/sample/agent').subscribe((data: any) => {
      console.log(data);
    });

    this.http.get('/api/user/agent').subscribe((data: any) => {
      console.log(data);
    });

    this.http.get('/api/super/agent').subscribe((data: any) => {
      console.log(data);
    });
  }

  getSystem(): void {
    this.http.get('/api/super/system').subscribe((data: any) => {
      console.log(data);
    });
  }

  getCollections(): void {
    this.http.get('/api/super/database').subscribe((data: any) => {
      console.log(data);
      this.databases = data.databases;
    });

    this.http.get('/api/super/database/collections').subscribe((data: any) => {
      console.log(data);
      this.database = data.database;
      this.collections = data.collections;
    });
  }

  getCache(): void {
    console.log(this.cacheKey);
    this.cacheErrorMessage = '';
    this.http.get(`/api/super/caches/${this.cacheKey}`).subscribe({
      next: res => {
        console.log(res);
        this.cacheValue = (res as any).value;
      },
      error: err => {
        console.log(err);
        console.log(err.error);
        this.cacheErrorMessage = err.error.code;
      }
    })
  }

  updateCache(): void {
    console.log(this.cacheKey);
    console.log(this.cacheValue);
    this.cacheErrorMessage = '';
    this.http.post(`/api/super/caches`, {
      key: this.cacheKey,
      value: this.cacheValue,
      expireInHour: 1
    }).subscribe({
      next: res => {
        console.log(res);
        this.cacheKey = '';
        this.cacheValue = '';
      },
      error: err => {
        console.log(err);
        console.log(err.error);
        this.cacheErrorMessage = err.error.code;
      }
    })
  }

  deleteCache(): void {
    this.http.delete(`/api/super/caches/${this.cacheKey}`).subscribe({
      next: res => {
        console.log(res);
        this.cacheValue = '';
      },
      error: err => {
        console.log(err);
        console.log(err.error);
        this.cacheErrorMessage = err.error.code;
      }
    })
  }

  deleteAccount(): void {
    console.log(this.email);
    const confirmed = confirm('Are you sure to delete below user\n' + this.email);
    console.log(confirmed);
    if (confirmed) {
      this.http.delete(`/api/user/accounts/${this.email}`).subscribe((data: any) => {
        console.log(data);
      });
    }
  }

  deleteHistory(): void {
    const confirmed = confirm('Are you sure to delete user history\n' + this.email);
    console.log(confirmed);
    if (confirmed) {
      this.http.delete(`/api/super/events/${this.email}`).subscribe((data: any) => {
        console.log(data);
      });
    }
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DashboardService } from '../dashboard.service';
import { MatRadioModule } from '@angular/material/radio';
import { EventEntity } from '@phantom-chen/cloud77';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRadioModule
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {

  constructor(
    private http: HttpClient,
    @Inject('DashboardService') private service: DashboardService) { }

  ngOnInit(): void {
    this.service.gateway.loginSession$.subscribe(res => {
      this.loading = false;
      if (res.expiration) {
        this.isLogin = true;

        this.http.get('/api/super/events/names').subscribe((data: any) => {
          console.log(data);
          this.eventNames = data as string[];
        });
      }
    });
    this.service.gateway.validateToken();
  }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  eventName = "";
  eventNames: string[] = [];
  email = "";
  loading = true;
  isLogin = false;
  events: EventEntity[] = [];
  searchType = 'event_name';

  onValueChange(value: string) {
    console.log(value);
  }

  onEmailChange(event: any) {
    console.log(event);
  }

  searchEvents(): void {
    console.log(this.searchType, this.eventName, this.email);
    
    if (this.searchType === 'event_name') {
      if (!this.eventName) return;
      this.http.get(`/api/super/events?name=${this.eventName}&index=0&size=5`).subscribe((data: any) => {
        this.updateTable(data);
      });
    } else {
      if (!this.email) return;
      this.http.get(`/api/super/events/${this.email}`).subscribe((data: any) => {
        this.updateTable(data);
      });
    }
  }

  updateTable(data: any): void {
    console.log(data);
    // this.events = (data.data as EventEntity[]).filter(e => !e.name.includes('License') && !e.name.includes('Device'));
    this.events = (data.data as EventEntity[]);
  }
}

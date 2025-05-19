import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { EventEntity } from '@phantom-chen/cloud77';

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
  constructor(private http: HttpClient) {}

  databases: string[] = [];
  collections: string[] = [];
  database: string = '';
  email: string = '';
  events: EventEntity[] = [];
  ngOnInit(): void {
    this.http.get('/user-api/database').subscribe((data: any) => {
      console.log(data);
      this.databases = data.databases;
    });

    this.http.get('/user-api/database/collections').subscribe((data: any) => {
      console.log(data);
      this.database = data.database;
      this.collections = data.collections;
    });
  }

  queryEvents(): void {
    console.log(this.email);
    if (!this.email) return;
    this.http.get(`/user-api/events/${this.email}`).subscribe((data: any) => {
      // this.events = (data.data as EventEntity[]).filter(e => !e.name.includes('License') && !e.name.includes('Device'));
      this.events = (data.data as EventEntity[]);
    });
  }
}

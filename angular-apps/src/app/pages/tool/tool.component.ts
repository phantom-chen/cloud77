import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { debugMode, mockupData } from '../../storage';

@Component({
  selector: 'app-tool',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatButtonModule
  ],
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.css'
})
export class ToolComponent implements OnInit {

  constructor(private http: HttpClient) {}
  
  debugButton: string = '';
  mockDataButton: string = '';

  databases: string[] = [];
  collections: string[] = [];
  database: string = "";
  ngOnInit(): void {
    this.updateButtonTexts();
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

  toggleDebugMode(): void {
    if (sessionStorage.getItem('cloud77_debug')) {
      sessionStorage.removeItem('cloud77_debug');
    } else {
      sessionStorage.setItem('cloud77_debug', 'cloud77_debug');
    }

    this.updateButtonTexts();
  }

  toggleMockData(): void {
    if (sessionStorage.getItem('cloud77_mockup')) {
      sessionStorage.removeItem('cloud77_mockup');
    } else {
      sessionStorage.setItem('cloud77_mockup', 'cloud77_mockup');
    }

    this.updateButtonTexts();
  }

  updateButtonTexts(): void {
    this.debugButton = debugMode() ? 'Switch to no debug mode (no logs are shown)' : 'Switch to debug mode (logs are shown)';
    this.mockDataButton = mockupData() ? 'Switch to real API data' : 'Switch to mock data';
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tool',
  standalone: true,
  imports: [],
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.css'
})
export class ToolComponent implements OnInit {

  constructor(private http: HttpClient) {}
  
  databases: string[] = [];
  collections: string[] = [];
  database: string = "";
  ngOnInit(): void {
    this.http.get('/api/database').subscribe((data: any) => {
      console.log(data);
      this.databases = data.databases;
    });

    this.http.get('/api/database/collections').subscribe((data: any) => {
      console.log(data);
      this.database = data.database;
      this.collections = data.collections;
    });
  }

  
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-database',
  standalone: true,
  imports: [],
  templateUrl: './database.component.html',
  styleUrl: './database.component.css'
})
export class DatabaseComponent implements OnInit {
  constructor(private http: HttpClient) {}

  databases: string[] = [];
  collections: string[] = [];
  database: string = "";
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
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  title = 'Cloud77 Portal';
  repo = '';
  code = '';
  owner = '';
  name = '';
  url = '';
  developer = '';

  constructor(private http: HttpClient) {
  }
  ngOnInit(): void {
    this.http.get('/resources/site.json')
      .subscribe((data: any) => {
        console.log(data);
        this.repo = data.repository;
        this.code = data.code;
        this.owner = data.owner;
        this.name = data.name;
        this.url = data.url;
        this.developer = data.developer;
      });
  }
}

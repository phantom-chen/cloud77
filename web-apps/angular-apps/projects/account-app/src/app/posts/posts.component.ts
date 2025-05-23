import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCommonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  
  constructor(private http: HttpClient) {}
  
  id = "";
  posts = [];
  content = '';

  ngOnInit(): void {
    this.http.get('/user-api/posts').subscribe((data: any) => {
      console.log(data);
      console.log(data.data);
      this.posts = data.data.map((d: any) => d.id);
    });
  }

  onValueChange(value: string) {
    console.log(value);
    console.log(this.id);
    this.id = value;
    this.http.get(`/user-api/posts/${value}`, { responseType: 'text'}).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.content = String(data) ?? "";
      }
    });
  }

  update(): void {
    console.log(this.id);
    console.log(this.content);
    this.http.put(`/user-api/posts/${this.id}`, this.content)
      .subscribe(res => {
        
      });
  }
}

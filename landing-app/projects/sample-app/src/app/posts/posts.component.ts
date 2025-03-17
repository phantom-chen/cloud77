import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements AfterViewInit {
  content = 'hello world';
  name = 'hello';
  names: string[] = [];
  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.onGetPosts();
  }

  onGetPosts(): void {
    this.http.get<string[]>('/api/posts')
      .subscribe(res => {
        this.names = res;
      });
  }

  onSavePost(): void {
    console.log(this.content);
    this.http.post(`/api/posts/${this.name}`, { content: this.content })
    .subscribe(res => {
      this.onGetPosts();
    });
  }
}

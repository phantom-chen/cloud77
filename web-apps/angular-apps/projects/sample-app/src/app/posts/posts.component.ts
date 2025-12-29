import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MarkdownModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements AfterViewInit {
  data = '# hello world'
  content = 'hello world';
  name = 'hello';
  names: string[] = [];
  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.onGetPosts();
  }

  onGetPosts(): void {
    this.http.get<string[]>('/api/sample/posts')
      .subscribe(res => {
        this.names = res;
      });
  }

  onSavePost(): void {
    this.http.post(`/api/sample/posts/${this.name}`, { content: this.content })
    .subscribe(res => {
      this.onGetPosts();
    });
  }
}

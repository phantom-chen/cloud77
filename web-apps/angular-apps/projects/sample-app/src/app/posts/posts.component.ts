import { AfterViewInit, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { MarkdownModule } from 'ngx-markdown';

@Component({
    selector: 'app-posts',
    imports: [
    FormsModule,
    MarkdownModule
],
    templateUrl: './posts.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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

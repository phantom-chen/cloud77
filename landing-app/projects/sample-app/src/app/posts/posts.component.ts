import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {
  content = 'hello world';

  constructor(private http: HttpClient) {}

  onSavePost(): void {
    console.log(this.content);
    this.http.post('/api/posts/hello', { content: this.content })
    .subscribe(res => {
      console.log(res);

    });
  }
}

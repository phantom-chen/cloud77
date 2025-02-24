import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sample-app';
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

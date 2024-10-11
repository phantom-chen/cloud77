import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  id = '';
  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id') || '';
  }
}

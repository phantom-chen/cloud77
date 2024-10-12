import { AfterViewInit, Component } from '@angular/core';
import { GatewayService } from '../../gateway.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthorEntity } from '@phantom-chen/cloud77';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css'
})
export class AuthorsComponent implements AfterViewInit {
  authors: AuthorEntity[] = [];
  constructor(
    private service: GatewayService
  ) {}

  ngAfterViewInit(): void {
    this.service.getRole()
    .then(() => {
      this.service.getAuthors()
        .then(res => {
          console.log(res);
          this.authors = res.data;
        })
    })
  }

}

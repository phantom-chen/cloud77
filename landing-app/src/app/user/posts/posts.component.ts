import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GatewayService } from '../../gateway.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserPost } from '@phantom-chen/cloud77';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    PostDialogComponent
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements AfterViewInit {
  email = '';
  posts: UserPost[] = [];
  selectedPost: UserPost = {
    id: '',
    title: '',
    description: ''
  };
  constructor(
    private service: GatewayService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.service.getRole()
    .then(res => {
      this.email = res.user?.email || '';
      this.service.getPosts(this.email).then(res => {
        this.posts = res.data;
        this.selectedPost = this.posts[0];
      });
    })
  }

  onValueChange(event: string) {
    console.log(event);
    // this.service.getPostContent(event).subscribe(res => {
    //   this.model = {
    //     value: res,
    //     language: "markdown"
    //   }
    // });
  }

  createPost(): void {
    const post: UserPost = {
      id: '',
      title: '',
      description: ''
    };
    const dialogRef = this.dialog.open(PostDialogComponent, {
      width: '450px',
      data: post
    });
    dialogRef.afterClosed().subscribe((v: UserPost) => {
      console.log(v);
      if (v) {
        if (v.id === '') {
          this.service.createPost(
            this.email, {
              id: '',
              title: v.title,
              description: v.description
          }).then(res => {
            console.log(res);
          })
        } else {

        }
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../account.service';
import { UserPost } from '@phantom-chen/cloud77';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { UnAuthorizedComponent } from '../un-authorized/un-authorized.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    UnAuthorizedComponent
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {

  constructor(
    @Inject('AccountService') private service: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  id = "";
  posts: UserPost[] = [];
  loading: boolean = true;
  isLogin: boolean = false;

  ngOnInit(): void {
    this.service.gateway.loginSession$.subscribe({
      next: res => {
        this.loading = false;
        if (res.expiration) {
          this.isLogin = true;
          this.service.getPosts().subscribe((data: any) => {
            this.posts = data.data.map((d: any) => d as UserPost);
          });
        }
      }
    });
    this.service.gateway.validateToken();
  }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  onValueChange(value: string) {
    this.id = value;
  }

  edit(): void {
    if (!this.id) return;
    this.router.navigate([this.id], { relativeTo: this.route });
  }

  create(): void {
    const post: UserPost = {
      id: '',
      title: '',
      description: '',
    };
    const dialogRef = this.dialog.open(PostDialogComponent, {
      width: '450px',
      data: Object.assign({}, post)
    });

    dialogRef.afterClosed().subscribe((result: UserPost) => {
      if (result) {
        console.log(result);
        this.service.createPost(result).subscribe(res => console.log(res));
      }
    })
  }
}

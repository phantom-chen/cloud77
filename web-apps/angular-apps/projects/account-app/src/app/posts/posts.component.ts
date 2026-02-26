import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { AccountService } from '../account.service';
import { UserPost } from '@phantom-chen/cloud77';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { UnAuthorizedComponent } from '../un-authorized/un-authorized.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NuMonacoEditorComponent, NuMonacoEditorModel, NuMonacoEditorModule } from '@ng-util/monaco-editor';
import { getTokens } from '@shared/storages';

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
    MatListModule,
    MatIconModule,
    NuMonacoEditorModule,
    UnAuthorizedComponent
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {

  constructor(
    @Inject('AccountService') private service: AccountService,
    private dialog: MatDialog
  ) { }

  posts: UserPost[] = [];
  loading: boolean = true;
  isLogin: boolean = false;

  id = '';
  title = '';
  description = '';
  content: string = '# hello world\n+ line1\n+ line2\n+ line3';

  options: monaco.editor.IStandaloneEditorConstructionOptions = { theme: "vs-dark", formatOnPaste: true };
  model: NuMonacoEditorModel = {
    value: '# hello world\n+ line1\n+ line2\n+ line3',
    language: "markdown",
  };

  @ViewChild(NuMonacoEditorComponent)
  public editor!: NuMonacoEditorComponent;

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

    this.service.gateway.get().subscribe({
      next: () => {
        this.service.gateway.validateToken(getTokens('session')).subscribe({
          error: err => {
            console.log(err);
          }
        });
      },
      error: err => {
        console.log(err);
      }
    })

    this.editor.autoFormat = true;
  }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  edit(post: UserPost): void {
    if (!post) return;
    this.id = post.id;
    this.title = post.title;
    this.description = post.description;

    this.service.getPostContent(this.id).subscribe((data: any) => {
      if (data) {
        this.content = String(data) ?? "";
        this.model.value = this.content;
        this.editor.editor?.setValue(this.content);
      }
    });
  }

  create(): void {
    this.id = '';
    this.title = '';
    this.description = '';
    this.content = '';
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

  update(): void {
    // not implemented yet
  }

  delete(): void {
    if (!this.id) return;
    this.service.deletePost(this.id).subscribe(() => {
      this.id = '';
      this.title = '';
      this.description = '';
      this.content = '';
    });
    // refresh posts list
    this.service.getPosts().subscribe((data: any) => {
      this.posts = data.data.map((d: any) => d as UserPost);
    });
  }

  syncContent(): void {
    this.content = this.editor.editor?.getValue() || '';
  }

  updateContent(): void {
    this.content = this.editor.editor?.getValue() || '';
    this.service.updatePostContent(this.id, this.content)
      .subscribe(() => {

      });
  }
}

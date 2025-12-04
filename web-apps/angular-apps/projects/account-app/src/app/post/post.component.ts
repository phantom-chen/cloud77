import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NuMonacoEditorComponent, NuMonacoEditorModel, NuMonacoEditorModule } from '@ng-util/monaco-editor';
import { AccountService } from '../account.service';
import { MatCommonModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { UnAuthorizedComponent } from '../un-authorized/un-authorized.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NuMonacoEditorModule,
    MatCommonModule,
    MatChipsModule,
    MatButtonModule,
    UnAuthorizedComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit, AfterViewInit {

  constructor(
    @Inject('AccountService') private service: AccountService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit(): void {
    this.service.gateway.loginSession$.subscribe({
      next: res => {
        this.loading = false;
        if (res.expiration) {
          this.isLogin = true;
          this.service.getPostContent(this.id).subscribe((data: any) => {
            if (data) {
              this.content = String(data) ?? "";
              this.model.value = this.content;
            }
          });
        }
      }
    });
    this.service.gateway.validateToken();
  }

  ngAfterViewInit(): void {
    this.editor.autoFormat = true;
  }

  @ViewChild(NuMonacoEditorComponent)
  public editor!: NuMonacoEditorComponent;

  loading: boolean = true;
  isLogin: boolean = false;

  id: string = '';
  content: string = '# hello\n+ todo1\n+ todo2';

  tags = ['angular', 'react', 'docker'];
  themes = ["vs", "vs-dark", "hc-black"];

  options: monaco.editor.IStandaloneEditorConstructionOptions = { theme: "vs-dark", formatOnPaste: true };
  model: NuMonacoEditorModel = {
    value: '# hello world',
    language: "markdown",
  };

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  sync(): void {
    console.log(this.editor.editor?.getValue() || '');
    this.content = this.editor.editor?.getValue() || '';
  }

  update(): void {
    this.service.updatePostContent(this.id, this.content)
      .subscribe(() => {

      });
  }
}

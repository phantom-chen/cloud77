import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { TasksComponent } from './tasks/tasks.component';
import { PostComponent } from './post/post.component';
import { MarkdownModule } from "ngx-markdown";
import { NuMonacoEditorModule } from "@ng-util/monaco-editor";

const routes: Routes = [
  {
    path: '',
    component: AccountComponent
  },
  {
    path: 'tasks',
    component: TasksComponent
  },
  {
    path: 'posts/:id',
    component: PostComponent
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    NuMonacoEditorModule.forRoot({
      baseUrl: '/monaco'
    }),
  ],
  providers: [
    provideRouter(routes)
  ]
})
export class UserModule { }

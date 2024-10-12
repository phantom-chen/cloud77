import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { TasksComponent } from './tasks/tasks.component';
import { PostComponent } from './post/post.component';
import { MarkdownModule } from "ngx-markdown";
import { NuMonacoEditorModule } from "@ng-util/monaco-editor";
import { SettingComponent } from './setting/setting.component';
import { PostsComponent } from './posts/posts.component';
import { FilesComponent } from './files/files.component';
import { ActivitiesComponent } from './activities/activities.component';
import { AuthorsComponent } from './authors/authors.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent
  },
  {
    path: 'setting',
    component: SettingComponent,
  },
  {
    path: 'tasks',
    component: TasksComponent
  },
  {
    path: 'posts',
    component: PostsComponent
  },
  {
    path: 'posts/:id',
    component: PostComponent
  },
  {
    path: 'files',
    component: FilesComponent
  },
  {
    path: 'activities',
    component: ActivitiesComponent
  },
  {
    path: 'authors',
    component: AuthorsComponent
  },
  {
    path: 'bookmarks',
    component: BookmarksComponent
  }
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

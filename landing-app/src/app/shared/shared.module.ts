import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnAuthorizedComponent } from './un-authorized/un-authorized.component';
import { PreviewComponent } from './preview/preview.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PreviewComponent,
    HeaderComponent,
    FooterComponent,
    UnAuthorizedComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PreviewComponent,
    HeaderComponent,
    FooterComponent,
    UnAuthorizedComponent
  ]
})
export class SharedModule { }

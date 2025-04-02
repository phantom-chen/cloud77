import { Component, Input } from '@angular/core';
import { BannerComponent } from "../banner/banner.component";
import { CardComponent, CardTitleComponent, SmallCardComponent, SocialComponent } from '../card/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [
    CommonModule,
    BannerComponent,
    CardTitleComponent,
    CardComponent,
    SmallCardComponent,
    SocialComponent
  ],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.css'
})
export class TutorialComponent {
  
}

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BannerComponent } from "../banner/banner.component";
import { CardComponent, CardTitleComponent, SmallCardComponent, SocialComponent } from '../card/card';


@Component({
    selector: 'app-tutorial',
    imports: [
    BannerComponent,
    CardTitleComponent,
    CardComponent,
    SmallCardComponent,
    SocialComponent
],
    templateUrl: './tutorial.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './tutorial.component.css'
})
export class TutorialComponent {
  
}

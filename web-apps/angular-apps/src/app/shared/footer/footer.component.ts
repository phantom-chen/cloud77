import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  @Input()
  repo: string = "";

  @Input()
  code: string = "";

  @Input()
  owner: string = "";

  @Input()
  developer: string = "";

  @Input()
  url: string = "";

  @Input()
  name: string = "";
}

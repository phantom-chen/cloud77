import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
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

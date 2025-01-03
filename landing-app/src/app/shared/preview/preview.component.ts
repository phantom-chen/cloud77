import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preview',
  standalone: false,
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent {
  @Input()
  content: string | undefined;
}

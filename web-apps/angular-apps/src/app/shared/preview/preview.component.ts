import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-preview',
  standalone: false,
  templateUrl: './preview.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './preview.component.css'
})
export class PreviewComponent {
  @Input()
  content: string | undefined;
}

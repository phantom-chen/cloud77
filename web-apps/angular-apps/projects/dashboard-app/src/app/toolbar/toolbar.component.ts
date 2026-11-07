
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-toolbar',
    imports: [],
    templateUrl: './toolbar.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  @Input()
  headers: { label: string, path: string }[] = [];
}

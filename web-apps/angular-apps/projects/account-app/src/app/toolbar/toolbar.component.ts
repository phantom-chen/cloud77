
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-toolbar',
    imports: [],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  @Input()
  headers: { label: string, path: string }[] = [];

  email = 'wip'
}

import { DragDropModule } from '@angular/cdk/drag-drop';

import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-drag-drop',
    imports: [
    DragDropModule
],
    templateUrl: './drag-drop.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './drag-drop.component.css'
})
export class DragDropComponent {

}

import { DragDropModule } from '@angular/cdk/drag-drop';

import { Component } from '@angular/core';

@Component({
    selector: 'app-drag-drop',
    imports: [
    DragDropModule
],
    templateUrl: './drag-drop.component.html',
    styleUrl: './drag-drop.component.css'
})
export class DragDropComponent {

}

import { Component } from '@angular/core';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  imports: [],
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.css'
})
export class ToolboxComponent {

  name = 'Cory Rylan';

  reverseString(): void {
    console.log('Toolbox component method called: reverseString');
    import('./string-helper').then(module => {
      this.name = module.reverseString(this.name);
    });
  }
}

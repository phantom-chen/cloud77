import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Person, PERSONS } from './person';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-angular',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './angular.component.html',
  styleUrl: './angular.component.css'
})
export class AngularComponent {
  items: string[] = ['string1', 'string2'];
  persons$: Observable<Person[]>;

  constructor() {
    this.persons$ = of(PERSONS);
  }

  openDialog(name: 'alert' | 'confirm' | 'prompt') {
    console.log(name);
    switch (name) {
      case 'alert':
        alert('wip\n' + name);
        break;
      case 'confirm':
        const confirmed = confirm('wip\n' + name);
        console.log(confirmed);
        break;
      case 'prompt':
        const result = prompt('wip\n' + name, name);
        console.log(result);
        break;
    }
  }
}

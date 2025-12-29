import { CommonModule } from '@angular/common';
import { Component, ContentChildren, contentChildren, Input, NgZone, QueryList, SimpleChanges, Version, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Person, PERSONS } from './person';
import { Observable, of } from 'rxjs';
import { AngularUIModule } from 'my-angular-ui';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: "app-my-button",
  standalone: true,
  imports: [CommonModule],
  template: `<button [ngStyle]="{'background-color':color}">{{content}}</button>`,
})
export class MyButtonComponent {
  @Input()
  content = "default content";

  @Input()
  color = 'red';
}

@Component({
  selector: "app-my-buttons",
  standalone: true,
  imports: [CommonModule],
  template: ` <div class="container">
    <p [ngStyle]="{'background-color':color}">{{content}}</p>
    <ng-content></ng-content>
    </div>`,
})
export class MyButtonsComponent {
  @Input()
  content = "default content";

  @Input()
  color = 'red';

  @ContentChildren(MyButtonComponent)
  buttons!: QueryList<MyButtonComponent>;
}

@Component({
  selector: 'app-angular',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AngularUIModule,
    BoardComponent,
    MyButtonsComponent,
    MyButtonComponent
],
  templateUrl: './angular.component.html',
  styleUrl: './angular.component.css'
})
export class AngularComponent {
  items: string[] = ['string1', 'string2'];
  persons$: Observable<Person[]>;
  color: string | undefined;
  array = [1, 3, 4, 5, 6];
  clicked: boolean = false;

  @ViewChildren(MyButtonsComponent)
  public buttons!: QueryList<MyButtonsComponent>;

  constructor(private zone: NgZone) {
    this.persons$ = of(PERSONS);
    const version = new Version('1.1.1');
    console.log(version.major);
    console.log('ng zone is stable:', this.zone.isStable);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      console.log(propName)
      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
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

  asyncTest(): void {
    new Promise((resolve, reject) => {
      this.clicked = !this.clicked;
      if (this.clicked) {
        resolve('button clicked true');
      }
      else {
        reject('button clicked false');
      }
    },).then(res => {
      return Promise.resolve<string>('find profile');
    }, err => {
      console.log(err);
      return Promise.resolve('already catch error');
    })
      .then(res => {

      }, err => {
        console.error(err);
        return Promise.resolve('todo');
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {

      });
  }

  updateButtonContent() {
    this.buttons.forEach(child => {
      child.content = 'child content updated';
      child.buttons.forEach(button => {
        button.color = 'accent';
        button.content = 'inner button';
      });
    });
  }
}

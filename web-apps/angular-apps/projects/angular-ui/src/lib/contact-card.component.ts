import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: 'app-contact-card',
    template: `
  <div>
    <h1>{{ name }}</h1>
    <p>{{ city }}</p>
  </div>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ContactCard {
    @Input() name!: string;
    @Input() city!: string;

    constructor() { }
}
import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-contact-card',
    template: `
  <div>
    <h1>{{ name }}</h1>
    <p>{{ city }}</p>
  </div>
  `})
export class ContactCard {
    @Input() name!: string;
    @Input() city!: string;

    constructor() { }
}
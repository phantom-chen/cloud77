import { Component, OnInit } from "@angular/core";
import clone from "clone";

function deepClone<T>(value: T): T {
  return clone<T>(value);
}

@Component({
  selector: "app-clone",
  standalone: true,
  imports: [],
  templateUrl: "./clone.component.html",
  styleUrl: "./clone.component.css",
})
export class CloneComponent implements OnInit {
  ngOnInit(): void {

  }

  deepCopy(): void {
    const objectA = { foo: { bar: "baz" } };

    const objectA1 = { ...objectA };

    const objectA3 = Object.assign({}, objectA);

    const objectA2 = JSON.parse(JSON.stringify(objectA));

    const objectA4 = deepClone(objectA);

    console.log(objectA1.foo.bar);
    console.log(objectA3.foo.bar);
    console.log(objectA4.foo.bar);

    setTimeout(() => {
      objectA.foo.bar = "abc";
      console.log(objectA1.foo.bar);
      console.log(objectA3.foo.bar);
      console.log(objectA4.foo.bar);
    }, 0);
  }
}

import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[app-board-container]',
    standalone: false
})
export class BoardContainerDirective {

    constructor(
        public container: ViewContainerRef
    ) {
        console.log("board container works")
    }
}
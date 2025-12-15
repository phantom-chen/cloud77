import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[app-board-container]'
})
export class BoardContainerDirective {

    constructor(
        public container: ViewContainerRef
    ) {
        console.log("board container works")
    }
}
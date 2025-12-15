import { Directive, ElementRef, Renderer2, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[logging]'
})
export class LoggingDirective {

    constructor(
        private elem: ElementRef,
        render: Renderer2
    ) {
        this.elem.nativeElement.style.color = 'red';
    }

    @HostBinding('style.color')
    color = 'red';

    @HostBinding('style.backgroundColor')
    get setColor() {
        return this.backgroundColor;
    }

    private backgroundColor = 'pink';

    @HostListener('click') onClick() {
        console.log('you are clicking this element')
        this.elem.nativeElement.innerText += 'C';
    }
}

import { Directive, Input, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: '[highlight]'
})
export class HighlightDirective {

    @Input('highlight') highlightColor: string | undefined;
    @Input() defaultColor: string | undefined;

    constructor(private el: ElementRef) {
    }

    @HostListener('mouseenter') onMouseEnter() {
        this.highlight(this.highlightColor || this.defaultColor || 'red')
        console.log('enter');
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.highlight(null);
        console.log('leave');
    }

    highlight(color: string | null): void {
        this.el.nativeElement.style.backgroundColor = color;
    }
}

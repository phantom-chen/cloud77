import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[rainbow]'
})
export class RainbowDirective {
    possibleColors = [
        'darksalmon', 'hotpink', 'lightskyblue', 'goldenrod', 'peachpuff',
        'mediumspringgreen', 'cornflowerblue', 'blanchedalmond', 'lightslategrey'
    ];

    @HostBinding('style.color') color?: string = this.possibleColors[0];
    @HostBinding('style.borderColor') borderColor?: string = this.possibleColors[1];
    @HostListener('keyup') onKeyUp() {
        const selectedColor = Math.floor(Math.random() * this.possibleColors.length);
        this.color = this.borderColor = this.possibleColors[selectedColor];
    }
}

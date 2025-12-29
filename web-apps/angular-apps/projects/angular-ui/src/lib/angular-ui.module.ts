import { NgModule } from "@angular/core";
import { TaskStatePipe } from "./task.pipe";
import { CommonModule } from "@angular/common";
import { BoardContainerDirective } from "./board-container.directive";
import { ContactCard } from "./contact-card.component";
import { HighlightDirective } from "./highlight.directive";
import { LoggingDirective } from "./logging.directive";
import { RainbowDirective } from "./rainbow.directive";

@NgModule({
    declarations: [
        ContactCard,
        TaskStatePipe,
        BoardContainerDirective,
        HighlightDirective,
        LoggingDirective,
        RainbowDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ContactCard,
        TaskStatePipe,
        BoardContainerDirective,
        HighlightDirective,
        LoggingDirective,
        RainbowDirective
    ]
})
export class AngularUIModule { }
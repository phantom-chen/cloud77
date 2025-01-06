import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NuMonacoEditorModel, NuMonacoEditorModule } from '@ng-util/monaco-editor';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    NuMonacoEditorModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  options: monaco.editor.IStandaloneEditorConstructionOptions = { theme: "vs-dark", formatOnPaste: true };
  model: NuMonacoEditorModel = {
    value: '# hello world',
    language: "markdown",
  };
}

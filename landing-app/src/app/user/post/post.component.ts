import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { NuMonacoEditorComponent, NuMonacoEditorModel, NuMonacoEditorModule } from "@ng-util/monaco-editor";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    MarkdownModule,
    NuMonacoEditorComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit, AfterViewInit {
  id = '';
  data = '# hello world'
  options: monaco.editor.IStandaloneEditorConstructionOptions = { theme: "vs-dark", formatOnPaste: true };
  model: NuMonacoEditorModel = {
    value: '# hello world',
    language: "markdown",
  };

  @ViewChild(NuMonacoEditorComponent)
  public editor!: NuMonacoEditorComponent;

  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id') || '';
  }
  ngOnInit(): void {
    this.model.value = this.data;
  }
  ngAfterViewInit(): void {
    this.editor.autoFormat = true;
  }
}

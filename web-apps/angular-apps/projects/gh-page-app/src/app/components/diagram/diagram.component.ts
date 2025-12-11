import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { MaterialDialogComponent } from '../material-dialog/material-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

const RawHTML = `
<div>
  <p>The <strong>rat</strong> hates the <strong>cat</strong></p>
  <p><i>This is something special</i></p>
  <div>
    <img src="https://www.kindacode.com/wp-content/uploads/2021/06/cute-dog.jpeg"/>
  </div>
  <h1>H1</h1>
  <h2>H2</h2>
  <h3>H3</h3>
  <h4>Just Another Heading</h4>
</div>
`;

@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './diagram.component.html',
  styleUrl: './diagram.component.css'
})
export class DiagramComponent {

  htmlValue: SafeHtml | undefined;

  @ViewChild("canvasSource")
  canvasSource!: ElementRef;

  constructor(private sanitizer: DomSanitizer, private dialog: MatDialog) {
    this.htmlValue = this.sanitizer.bypassSecurityTrustHtml(RawHTML);
  }

  screenshotDisabled = false;

  onScreenshot(): void {
    this.screenshotDisabled = true;
    html2canvas(this.canvasSource.nativeElement).then((canvas) => {
      canvas.style.display = 'block';
      canvas.style.margin = '0 auto';
      const dialogRef = this.dialog.open(MaterialDialogComponent, {
        width: '800px',
        data: canvas
      });

      dialogRef.afterClosed().subscribe(() => {
        this.screenshotDisabled = false;
      });
    });
  }
}

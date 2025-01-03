import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import html2canvas from 'html2canvas';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MaterialDialogComponent } from '../material-dialog/material-dialog.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

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
  selector: 'app-material',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    MatChipsModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './material.component.html',
  styleUrl: './material.component.css'
})
export class MaterialComponent {
  isLoading = true;
  role = 'role1';
  roles = ['role1', 'role2'];
  @ViewChild("canvasSource")
  canvasSource!: ElementRef;
  selected: Date | null = null;
  links = [
    { name: "link1", isActive: true },
    { name: "link2", isActive: true },
    { name: "link3", isActive: true },
  ]
  constructor(
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.htmlValue = this.sanitizer.bypassSecurityTrustHtml(RawHTML);
    this.selected = new Date();
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  htmlValue: SafeHtml | undefined;
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

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonToggleModule
  ],
  templateUrl: './material.component.html',
  styleUrl: './material.component.css'
})
export class MaterialComponent {
  
  view = "grid";
  
  onViewToggle(change: MatButtonToggleChange ) {
    const value = change.value as string;
    this.view = value;
  }
}

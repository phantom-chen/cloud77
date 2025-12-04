import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCommonModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './material.component.html',
  styleUrl: './material.component.css'
})
export class MaterialComponent {
  
  view = "grid";
  searchText: string = '';

  onViewToggle(change: MatButtonToggleChange ) {
    const value = change.value as string;
    this.view = value;
  }
}

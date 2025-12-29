import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatCommonModule, MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import {
  GridsterConfig,
  GridsterItem,
  GridsterModule,
} from "angular-gridster2";

@Component({
  selector: "app-material",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatButtonToggleModule,
    GridsterModule,
  ],
  templateUrl: "./material.component.html",
  styleUrl: "./material.component.css",
})
export class MaterialComponent {
  role = "role1";
  roles = ["role1", "role2"];
  links = [
    { name: "link1", isActive: true },
    { name: "link2", isActive: true },
    { name: "link3", isActive: true },
  ];

  selectedDate: Date | null = null;

  view = "grid";
  searchText: string = "";

  options: GridsterConfig;

  items: GridsterItem[] = [
    { cols: 2, rows: 1, x: 2, y: 0 },
    { cols: 2, rows: 2, x: 4, y: 0 },
  ];

  constructor() {
    this.selectedDate = new Date();
    this.options = {
      initCallback: (gridster) => {},
      gridSizeChangedCallback: (gridster) => {},
    };

    // after 2 seconds
    setTimeout(() => {
      this.items.push({ cols: 2, rows: 2, y: 1, x: 4 });
      this.items.push({ cols: 2, rows: 2, y: 2, x: 6 });
    }, 2000);
  } 

  onViewToggle(change: MatButtonToggleChange) {
    const value = change.value as string;
    this.view = value;
  }
}

import { AfterViewInit, Component } from '@angular/core';
import { GatewayService } from '../../gateway.service';
import { CommonModule } from '@angular/common';
import { MatListModule, MatSelectionListChange } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatSelectModule
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent implements AfterViewInit {
  loading = true;
  files: string[] = [];
  constructor(
    private service: GatewayService
  ) {}

  ngAfterViewInit(): void {
    this.service.getRole()
    .then(res => {
      console.log(res);
      this.service.getFiles(res.user?.email || '').then(res => {
        console.log(res);
        this.files = res.data;
        this.loading = false;
      });
    })
  }

  selectedFiles: string[] = [];

  onSelectedFilesChange(event: MatSelectionListChange) {
    this.selectedFiles = event.source.selectedOptions.selected.map(o => o.value as string)
  }
}

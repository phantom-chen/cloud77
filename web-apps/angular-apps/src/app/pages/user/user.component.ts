import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-user',
    imports: [RouterModule],
    templateUrl: './user.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  
  constructor() {}
  
  ngOnInit(): void {

  }
}

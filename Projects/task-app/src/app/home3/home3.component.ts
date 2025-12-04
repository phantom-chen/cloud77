import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home3.component.html',
  styleUrl: './home3.component.css'
})
export class Home3Component {
  title = 'Task Angular';
}

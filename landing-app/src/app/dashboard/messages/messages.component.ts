import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  message: string = "";
  email = '';
  subject = '';
  body = '';

  sendMessage(queue: string): void {
    if (this.message) {
      console.log('wip');
      console.log(this.message);
    } else {
      alert('empty message');
    }
  }

  sendMail(): void {
    console.log('wip');
    
  }
}

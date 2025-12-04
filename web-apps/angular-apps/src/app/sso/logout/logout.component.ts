import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
  ngOnInit(): void {
    this.channel.onmessage = (event) => {
      console.log('Received message:', event.data);
      // Handle the received message here
    }
  }

  channel: BroadcastChannel = new BroadcastChannel("testing");
}

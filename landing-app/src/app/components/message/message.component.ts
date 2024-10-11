import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
  ngOnInit(): void {
    window.addEventListener('message', function(ev) {
      if (ev.source !== window.parent)
      {
        return;
      }
      else
      {
        if (ev.data) {
          console.log(ev.data);
          if (ev.data.request === 'login') {
            sessionStorage.setItem('accessToken', ev.data.accessToken);
            sessionStorage.setItem('refreshToken', ev.data.refreshToken);
            console.log('succeed updating tokens');
          } else if (ev.data.request === 'logout') {
            sessionStorage.removeItem('email');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            console.log('succeed removing tokens');
          }
        }
      }
    });
  }
}

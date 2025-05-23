import { CommonModule } from '@angular/common';
import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';

@Injectable()
export class ChatSocket extends Socket {
  constructor() {
    super({
      url: '',
      options: {
        path: '/canteen-ws',
        upgrade: false,
        extraHeaders: {
          'Authorization': 'Bearer xxx',
        }
      },
    })
  }
}

@Component({
  selector: 'app-live-chat',
  standalone: true,
  imports: [
    CommonModule,
  ],
  providers: [
    ChatSocket
  ],
  templateUrl: './live-chat.component.html',
  styleUrl: './live-chat.component.css'
})
export class LiveChatComponent implements OnInit, OnDestroy {

  session = '';
  online = 0;

  private sessionSub: Subscription | undefined;
  private onlineSub: Subscription | undefined;

  constructor(private socket: ChatSocket) { }

  ngOnDestroy(): void {
    this.sessionSub?.unsubscribe();
    this.onlineSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.sessionSub = this.socket.fromEvent<{ id: string }>("session-id").subscribe(m => {
      this.session = m.id;
    });

    this.onlineSub = this.socket.fromEvent<{ online: number }>("online").subscribe((res) => {
      this.online = res.online;
    });
  }
}

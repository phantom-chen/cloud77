import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatSocket } from '../socket';

@Component({
  selector: 'app-chat-io',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat-io.component.html',
  styleUrl: './chat-io.component.css'
})
export class ChatIOComponent implements AfterViewInit, OnDestroy {
  messages: string[] = [];
  msg: string = '';
  
  roomInput = '';
  rooms: string[] = [];
  selectedRoom = '';
  documentInput = '';
  placeholder = 'Select an existing document or create a new one to get started.';
  documents: string[] = [];
  documentId: string = '';

  private sub2: Subscription | undefined;
  private sub4: Subscription | undefined;
  private sub5: Subscription | undefined;
  private sub6: Subscription | undefined;
  private sub7: Subscription | undefined;

  constructor(private socket: ChatSocket) {
    this.rooms = ['room1', 'room2', 'room3'];
    this.documentInput = this.placeholder;
  }
  ngOnDestroy(): void {

    this.sub2?.unsubscribe();

    this.sub4?.unsubscribe();
    this.sub5?.unsubscribe();
    this.sub6?.unsubscribe();
    this.sub7?.unsubscribe();
  }

  ngAfterViewInit(): void {
    
    this.sub2 = this.socket.fromEvent<string>("msg2client").subscribe(m => {
      this.messages.push(m);
      console.log(m);
    });
    
    this.sub4 = this.socket.fromEvent<{ rooms: string[] }>("get-rooms-response").subscribe((obj) => {
      this.rooms = obj.rooms;
      console.log(obj.rooms)
    });
    this.sub5 = this.socket.fromEvent<string[]>("document-list-changed").subscribe((obj) => {
      this.documents =  obj;
    });

    this.sub6 = this.socket.fromEvent<{ content: string }>("get-document-response").subscribe((obj) => {
      this.documentInput =  obj.content;
    });

    this.sub7 = this.socket.fromEvent<{ id: string }>("document-changed").subscribe((obj) => {
      if (this.documentId === obj.id) {
        this.socket.emit('get-document', { id: this.documentId });
      }
    });
  }

  sendMessage(event: SubmitEvent) {
    event.preventDefault();

    if (!this.msg) return;
    this.socket.emit("msg2server", this.msg);
    this.msg = '';
    window.scrollTo(0, document.body.scrollHeight);
    // this.hubConnection?.send("ping", this.msg);
  }

  clickRoom(room: string) {
    console.log(room);
    this.selectedRoom = room;
  }

  createRoom() {
    if (this.roomInput !== '') {
      this.socket.emit('add-room', { room: this.roomInput });
    }

    this.roomInput = '';
  }

  deleteRoom() {
    if (this.roomInput !== '') {
      this.socket.emit('remove-room', { room: this.roomInput });
    }

    this.roomInput = '';
  }

  createDocument(): void {
    this.documentId = 'xxxxxx';
    this.socket.emit('create-document', { id: this.documentId });
    this.documentInput = '';
  }

  getDocumentContent(id: string): void {
    this.documentId = id;
    this.socket.emit('get-document', { id });
  }

  onEditDocument(): void {
    this.socket.emit('update-document', { id: this.documentId, content: this.documentInput });
  }

  deleteDocument(): void {
    this.socket.emit('delete-document', { id: this.documentId });
    this.documentId = '';
    this.documentInput = this.placeholder;
  }
}

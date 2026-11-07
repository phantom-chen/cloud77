import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-first-page',
  styleUrl: './first-page.css',
  templateUrl: './first-page.html',
})
export class FirstPage implements OnInit {
  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.http.get('/api/gateway').subscribe(res => {
      console.log(res);
    })
  }

  @HostListener('window:storage', ["$event"])
  onStorageChange(event: StorageEvent) {
    console.log(event.storageArea === localStorage ? "local storage" : '')
    console.log(event.storageArea === sessionStorage ? "session storage" : '')
    console.log(event)
  }
}

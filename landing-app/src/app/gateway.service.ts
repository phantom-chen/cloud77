import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { GatewayService as GatewayApp } from "@phantom-chen/cloud77";

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  constructor(private http: HttpClient) { }

  testing(): void {
    console.warn('testing')
  }

  ping(): void {
    this.http.get<GatewayApp>('/api/gateway')
    .pipe(
      tap(app => {
        console.log(app);
        localStorage.setItem('apikey', app.apikey);
      })
    ).subscribe(res => {
      console.log(res);
    });
  }
}

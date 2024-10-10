import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, tap } from 'rxjs';
import { GatewayService as GatewayApp, UserAccount, UserToken } from "@phantom-chen/cloud77";

export const GatewayPrefix = '/api';
export const IdentityAppPrefix = '/identity-app';
export const UserAppPrefix = '/user-app';
export const CanteenAppPrefix = '/canteen-app';
export const FactoryAppPrefix = '/factory-app';
export const TokenPath = `${IdentityAppPrefix}/users/tokens`;

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  constructor(private http: HttpClient) { }

  testing(): void {
    console.debug('testing')
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

  getToken(user: {
    email?: string | null,
    name?: string | null,
    password?: string | null,
    token?: string | null
  }): Promise<UserToken> {

    let params = new HttpParams();
    if (user.email && user.email !== '') {
      params = params.set('email', user.email.toLowerCase());
    }
    if (user.name && user.name !== '') {
      params = params.set('username', user.name.toLowerCase());
    }
    if (user.password && user.password !== '') {
      params = params.set('password', user.password);
    }
    if (user.token && user.token !== '') {
      params = params.set('refreshToken', user.token);
    }

    return lastValueFrom(this.http.get<UserToken>(TokenPath, { params }));
  }

  getAccount(email: string): Promise<UserAccount | undefined> {
    return lastValueFrom(
      this.http.get<UserAccount>(`${UserAppPrefix}/accounts/${email}`)
    );
  }
}

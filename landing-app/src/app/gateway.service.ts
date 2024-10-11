import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map, Observable, Subject, tap } from 'rxjs';
import { GatewayService as GatewayApp, UserAccount, UserRole, UserTasks, UserToken } from "@phantom-chen/cloud77";

export const GatewayPrefix = '/api';
export const IdentityAppPrefix = '/identity-app';
export const UserAppPrefix = '/user-app';
export const CanteenAppPrefix = '/canteen-app';
export const FactoryAppPrefix = '/factory-app';

let tokenValid = false;
let email = '';
let role = '';
let name = "";

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  constructor(private http: HttpClient) { }

  public succeedLogin: Subject<void> = new Subject();

  testing(): void {
    console.debug('testing')
  }

  public get isRemote() : boolean {
    return sessionStorage.getItem('mockup') ? false : true;
  }

  ping(): void {
    if (this.isRemote) {
      this.http.get<GatewayApp>('/api/gateway')
      .pipe(
        tap(app => {
          console.log(app);
          localStorage.setItem('apikey', app.apikey);
        })
      ).subscribe(res => {
        console.log(res);
      });
    } else {
      console.log('mockup');
    }
  }

  getToken(user: {
    email?: string | null,
    name?: string | null,
    password?: string | null,
    token?: string | null
  }): Promise<UserToken> {

    if (!this.isRemote) {
      return new Promise((resolve, reject) => {
        resolve({
          email: '',
          value: '',
          refreshToken: '',
          issueAt: '',
          expireInHours: 0
        })
      });
    }

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

    return lastValueFrom(this.http.get<UserToken>(`${IdentityAppPrefix}/users/tokens`, { params }));
  }

  getAccount(email: string): Promise<UserAccount | undefined> {
    if (!this.isRemote) {
      return new Promise((resolve, reject) => {
        resolve({
          email: 'xxx',
          name: 'xxx',
          existing: false,
          confirmed: false,
          profile: {
            surname: 'xxx',
            givenName: 'xxx',
            city: 'xxx',
            phone: 'xxx',
            company: 'xxx',
            companyType: 'xxx',
            title: 'xxx',
            contact: 'xxx',
            fax: 'xxx',
            post: 'xxx',
            supplier: 'xxx'
          }
        })
      });
    }

    return lastValueFrom(
      this.http.get<UserAccount>(`${UserAppPrefix}/accounts/${email}`)
    );
  }

  getRole(): Promise<{ user: UserRole | undefined, exp: string }> {
    if (!this.isRemote) {
      return new Promise((resolve, reject) => {
        resolve({
          user: {
            email: 'xxx',
            name: 'xxx',
            role: 'xxx'
          },
          exp: ''
        })
      });
    }

    if (!sessionStorage.getItem('accessToken')) {
      return Promise.resolve({
        user: {
          email: '',
        name: '',
        role: '',
        },
        exp: ''
      });
    }
    if (tokenValid) {
      return Promise.resolve({
        user: {
          email: email,
          name: name,
          role: role
        }, exp: sessionStorage.getItem('token-expiration') || ''
      });
    } else {
      return lastValueFrom(
        this.http.get<UserRole>(`${UserAppPrefix}/users/roles`, { observe: 'response' })
        .pipe(
          tap(res => {
            tokenValid = true;
            email = res.body?.email || '';
            name = res.body?.name || '',
            role = res.body?.role || '';
            sessionStorage.setItem('token-expiration', res.headers.get('x-token-expiration') || '');
            this.succeedLogin.next();
          }),
          map(res => {
            return {
              user: res.body ?? undefined,
              exp: res.headers.get('x-token-expiration') || ''
            };
          })
        )
      );
    }

  }

  getTasks(email: string): Observable<UserTasks> {
    return this.http.get<UserTasks>(`${UserAppPrefix}/tasks/${email}`);
  }
}

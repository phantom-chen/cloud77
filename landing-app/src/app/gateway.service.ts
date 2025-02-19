import { HttpClient } from '@angular/common/http';
import { mockupData } from './storage';
import { lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { DefaultResponse, UserAccount, UserEmail, UserToken } from '@phantom-chen/cloud77';

export const SNACKBAR_DURATION = 3000;

export interface IGatewayService {
  getSite(): Promise<string>;
  getUser(account: string): Promise<UserEmail>;
  createUser(
    email: string,
    name: string,
    password: string
  ): Promise<DefaultResponse>;
  confirmEmail(email: string, token: string): Promise<DefaultResponse>;
  generateToken(email: string, password: string): Promise<UserToken>;
}

@Injectable()
export class GatewayService implements IGatewayService {
  constructor(private http: HttpClient) {}

  getSite(): Promise<string> {
    if (mockupData()) {
      return Promise.resolve('https://www.google.com');
    }

    return lastValueFrom(
      this.http.get('/resources/site.json', { responseType: 'text' })
    );
  }

  createUser(
    email: string,
    name: string,
    password: string
  ): Promise<DefaultResponse> {
    if (mockupData()) {
      return Promise.resolve({
        code: 'mock-up',
        message: 'success',
        id: '',
      });
    }

    return lastValueFrom(
      this.http.post<DefaultResponse>('/api/users', {
        email: email,
        name: name,
        password: password,
      })
    );
  }

  confirmEmail(email: string, token: string): Promise<DefaultResponse> {
    if (mockupData()) {
      return Promise.resolve({
        code: 'mock-up',
        message: 'success',
        id: '',
      });
    }

    return lastValueFrom(
      this.http.put<DefaultResponse>(
        `/api/users/verification?email=${email}`,
        undefined,
        {
          headers: {
            'x-cloud77-onetime-token': token,
          },
        }
      )
    );
  }

  generateToken(email: string, password: string): Promise<UserToken> {
    if (mockupData()) {
      return Promise.resolve({
        email: email,
        value: 'mock-up',
        refreshToken: 'mock-up',
        expireInHours: 1,
        issueAt: new Date().toString(),
      });
    }

    return lastValueFrom(
      this.http.post<UserToken>(
        `/api/users/token?email=${email}&password=${password}`,
        undefined
      )
    );
  }

  getUser(account: string): Promise<UserEmail> {
    if (mockupData()) {
      return Promise.resolve({
        email: account,
        existing: false
      });
    }

    return lastValueFrom(
      this.http.get<UserEmail>(`/api/users?email=${account}&username=abc`)
    )
  }
}

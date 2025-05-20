import { HttpClient, HttpResponse } from '@angular/common/http';
import { lastValueFrom, map } from 'rxjs';
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
    validateToken(): Promise<string>;
}

@Injectable()
export class GatewayService implements IGatewayService {
    constructor(private http: HttpClient) { }

    getSite(): Promise<string> {
        return lastValueFrom(
            this.http.get('/resources/site.json', { responseType: 'text' })
        );
    }

    createUser(
        email: string,
        name: string,
        password: string
    ): Promise<DefaultResponse> {
        return lastValueFrom(
            this.http.post<DefaultResponse>('/sso-api/users', {
                email: email,
                name: name,
                password: password,
            })
        );
    }

    confirmEmail(email: string, token: string): Promise<DefaultResponse> {
        return lastValueFrom(
            this.http.put<DefaultResponse>(
                `/sso-api/users/verification?email=${email}`,
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
        return lastValueFrom(
            this.http.post<UserToken>(
                `/sso-api/users/token?email=${email}&password=${password}`,
                undefined
            )
        );
    }

    getUser(account: string): Promise<UserEmail> {
        return lastValueFrom(
            this.http.get<UserEmail>(`/sso-api/users?email=${account}&username=abc`)
        )
    }

    validateToken(): Promise<string> {
        return lastValueFrom(
            this.http.get<HttpResponse<string>>(`/user-api/accounts/role`, { observe: 'response' })
            .pipe(map(res => {
                return res.headers.get('x-token-expiration') ?? '';
            }))
        );
    }
}

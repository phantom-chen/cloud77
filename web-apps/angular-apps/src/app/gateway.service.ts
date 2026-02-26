import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserRole } from "@phantom-chen/cloud77";
import { Observable, timeout, catchError, of, map } from "rxjs";
import { TokenValidationResult } from "./sso/sso.service";
import { HTTP_TIMEOUT_SECOND } from "@shared/constants";
import { apiKey } from "@shared/storages";

@Injectable()
export class GatewayService {

    constructor(private http: HttpClient) { }

    isHealth(): Observable<string> {
        return this.http.get('/api/health', { responseType: 'text' }).pipe(timeout(HTTP_TIMEOUT_SECOND * 1000));
    }

    get(): Observable<{ key: string }> {
        if (!apiKey()) {
            return this.http.get('/api/gateway').pipe(
                timeout(HTTP_TIMEOUT_SECOND * 1000),
                catchError(err => {
                    console.error('Caught error:', err);
                    console.error('Error fetching gateway data:', err);
                    return of({ key: '' });
                }),
                map((data: any) => {
                    localStorage.setItem('sso_url', data.sso);
                    localStorage.setItem('home_url', data.home);
                    localStorage.setItem('api_key', data.key);
                    return { key: data.key }
                }
                ));
        }
        else {
            return new Observable(observer => {
                observer.next({ key: apiKey() });
                observer.complete();
            })
        }
    }

    validateToken(): Observable<TokenValidationResult> {
        return this.http.get<UserRole>(`/api/user/accounts/role`, { observe: 'response' })
            .pipe(map(res => {
                return {
                    ...res.body,
                    expiration: res.headers.get('x-token-expiration') ?? ''
                } as TokenValidationResult;
            }))
    }

    getRole(): void {
        this.http.get('/api/sso/tokens/validation')
        .subscribe(res => {
            console.log('Token validation response:', res);
            // id, message, code
            // bad request
            // incorrect
            // expired
        })
    }
}
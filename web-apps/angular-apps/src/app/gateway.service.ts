import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserRole } from "@phantom-chen/cloud77";
import { Observable, timeout, catchError, of, map } from "rxjs";
import { TokenValidationResult } from "./sso/sso.service";

const timeoutSeconds = 3;

@Injectable()
export class GatewayService {

    constructor(private http: HttpClient) { }

    isHealth(): Observable<string> {
        return this.http.get('/api/health', { responseType: 'text' }).pipe(timeout(timeoutSeconds * 1000));
    }

    get(): Observable<{ key: string }> {
        if (!localStorage.getItem('api_key')) {
            return this.http.get('/api/gateway').pipe(
                timeout(timeoutSeconds * 1000),
                catchError(err => {
                    console.error('Caught error:', err);
                    console.error('Error fetching gateway data:', err);
                    return of({ key: '' }); // Provide a fallback value
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
                observer.next({ key: localStorage.getItem('api_key') ?? '' });
                observer.complete();
            })
        }
    }

    validateToken(): Observable<TokenValidationResult> {
        return this.http.get<UserRole>(`/api/user/accounts/role`, { observe: 'response' })
            .pipe(map(res => {
                // console.log('Token validation response:', res);
                // console.log(res.body);
                // console.log(res.body?.role);
                // res.body
                console.log('Token expiration header:', res.headers.get('x-token-expiration'));
                return {
                    ...res.body,
                    expiration: res.headers.get('x-token-expiration') ?? ''
                } as TokenValidationResult;
            }))
    }
}
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserEmail, UserRole } from '@phantom-chen/cloud77';
import { catchError, lastValueFrom, map, Observable, of, Subject, timeout } from 'rxjs';
import { HTTP_TIMEOUT_SECOND } from './constants';
import { TokenValidationResult } from './models';
import { apiKey } from './storages';

let email = '';
let name = "";
let expiration = "";
let tokenIsValid = false;

export class GatewayService {

    ssoSignIn$: Subject<void> = new Subject<void>();

    loginSession$: Subject<{ email: string, name: string, expiration: string }> = new Subject<{ email: string, name: string, expiration: string }>();

    constructor(private http: HttpClient) { }

    getSite(): Promise<string> {
        return lastValueFrom(
            this.http.get('/resources/site.json', { responseType: 'text' })
        );
    }

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
                observer.next({ key: apiKey() });
                observer.complete();
            })
        }
    }

    validateToken(tokens: { access: string, refresh: string }): Observable<TokenValidationResult> {
        loadLoginSession();
        if (!tokens.access) {
            this.loginSession$.next({ email, name, expiration });
            return new Observable(observer => {
                observer.next({
                    email: '',
                    name: '',
                    role: '',
                    expiration: ''
                });
                observer.complete();
            })
        }

        if (expiration && email) {
            this.loginSession$.next({ email, name, expiration });
            return new Observable(observer => {
                observer.next({
                    email,
                    name,
                    role: '',
                    expiration
                });
                observer.complete();
            })
        }

        return this.http.get<UserRole>(`/api/user/accounts/role`, { observe: 'response' })
            .pipe(map(res => {
                email = res.body?.email || '';
                name = res.body?.name || '';
                expiration = res.headers.get('x-token-expiration') ?? '';

                this.loginSession$.next({ email, name, expiration });

                sessionStorage.setItem('user_email', res.body?.email || '');
                sessionStorage.setItem('user_name', res.body?.name || '');

                return {
                    ...res.body,
                    expiration: res.headers.get('x-token-expiration') ?? ''
                } as TokenValidationResult;
            }))
    }

    /**
     * @deprecated
     */
    getU11ser(email: string, name: string): Promise<UserEmail> {
        let params = new HttpParams();
        if (email && email !== '') {
            params = params.set('email', email.toLowerCase());
        }
        if (name && name !== '') {
            params = params.set('username', name.toLowerCase());
        }
        return lastValueFrom(
            this.http.get<UserEmail>('/api/sso/users', { params })
                .pipe(timeout(3000))
        )
    }
}

export function exitLoginSession(): void {
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_access_token');
    sessionStorage.removeItem('user_refresh_token');

    expiration = '';
    name = '';
    email = '';
}

export function saveLoginSession(): void {
    if (expiration) {
        sessionStorage.setItem('session_expiration', expiration);
    }
    if (tokenIsValid) {
        sessionStorage.setItem('session_token_valid', 'true');
    }
}

export function loadLoginSession(): void {
    const sessionExpiration = sessionStorage.getItem('session_expiration');
    if (sessionExpiration) {
        expiration = sessionExpiration;
        sessionStorage.removeItem('session_expiration');
        email = sessionStorage.getItem('user_email') || '';
        name = sessionStorage.getItem('user_name') || '';
    }
    if (sessionStorage.getItem('session_token_valid')) {
        tokenIsValid = true;
        sessionStorage.removeItem('session_token_valid');
    }
}
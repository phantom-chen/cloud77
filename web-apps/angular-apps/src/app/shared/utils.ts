import { HttpClient, HttpParams } from '@angular/common/http';
import { UserEmail, UserRole } from '@phantom-chen/cloud77';
import { Buffer } from 'buffer';
import { Md5 } from "md5-typescript";
import { catchError, lastValueFrom, map, Observable, of, Subject, timeout } from 'rxjs';

export const GatewayPrefix = '/api';
export const SSOAppPrefix = '/api/sso';
export const UserAppPrefix = '/api/user';

export const TimeoutSeconds = 3;
export const SNACKBAR_DURATION = 3000;

let email = '';
let name = "";
let expiration = "";

export function hashString(value: string): string {
    return Md5.init(value);
}

// window.btoa();
export function convertToBase64(value: string): string {
    const buffer = Buffer.from(value);
    return buffer.toString('base64');
}

// window.atob();
export function convertFromBase64(value: string): string {
    const buffer = Buffer.from(value, 'base64');
    return buffer.toString();
}

export function debugMode(): boolean {
    return sessionStorage.getItem('user_debug_mode') ? true : false;
}

export function getUserEmail(): string {
    return localStorage.getItem('cloud77_user_email') ?? '';
}

export function updateUserEmail(email: string): void {
    localStorage.setItem('cloud77_user_email', email);
}

export function getUserEmails(isLogin: boolean = true): string[] {
    const users = localStorage.getItem("cloud77_user_emails")?.split(',') ?? [];
    if (!isLogin) return users;

    const _users: string[] = users.map(u => {
        return localStorage.getItem(`cloud77_access_token_${hashString(u)}`) ? u : '';
    });

    return _users.filter(u => u);
}

export function addUserEmail(email: string): void {
    const emails = getUserEmails();
    if (!emails.includes(email)) {
        emails.push(email);
        localStorage.setItem('cloud77_user_emails', emails.join(','));
    }
}

export function removeTokens(): void {
    localStorage.removeItem(`cloud77_user_access_token`);
    localStorage.removeItem(`cloud77_user_refresh_token`);
    sessionStorage.removeItem(`user_access_token`);
    sessionStorage.removeItem(`user_refresh_token`);
}

export function removeUserEmail(email: string): void {
    removeTokens();
    const users = getUserEmails();
    localStorage.setItem('cloud77_user_emails', users.filter(u => u != email).join(','));
}

export function saveTokens(access: string, refresh: string): void {
    localStorage.setItem(`cloud77_user_access_token`, access);
    localStorage.setItem(`cloud77_user_refresh_token`, refresh);
    syncTokens();
}

export function syncTokens(): void {
    sessionStorage.setItem('user_access_token', localStorage.getItem(`cloud77_user_access_token`) ?? '');
    sessionStorage.setItem('user_refresh_token', localStorage.getItem(`cloud77_user_refresh_token`) ?? '');
}

export function getTokens(session: boolean = true): { access: string, refresh: string } {
    if (session) {
        return {
            access: sessionStorage.getItem(`user_access_token`) ?? '',
            refresh: sessionStorage.getItem(`user_refresh_token`) ?? ''
        }
    } else {
        return {
            access: localStorage.getItem(`user_access_token`) ?? '',
            refresh: localStorage.getItem(`user_refresh_token`) ?? ''
        }
    }
}

export function timestampToDate(timestamp: string): Date {
    const year = Number(timestamp.substring(0, 4));
    const month = Number(timestamp.substring(4, 6));
    const day = Number(timestamp.substring(6, 8));
    const hour = Number(timestamp.substring(8, 10));
    const minute = Number(timestamp.substring(10, 12));
    const second = Number(timestamp.substring(12, 14));
    const date = new Date();
    date.setUTCFullYear(year, month, day);
    date.setUTCHours(hour, minute, second);
    return date;
}

export function getRemainingTime(date1: Date, date2: Date): {
    day: number,
    hour: number,
    minute: number
} {
    return {
        day: date2.getUTCDate() - date1.getUTCDate(),
        hour: date2.getUTCHours() - date1.getUTCHours(),
        minute: date2.getUTCMinutes() - date1.getUTCMinutes()
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
        console.log('Saving login session:', { expiration });
        sessionStorage.setItem('session_expiration', expiration);
    }
}

export function loadLoginSession(): void {
    const sessionExpiration = sessionStorage.getItem('session_expiration');
    if (sessionExpiration) {
        console.log('Loading login session:', { sessionExpiration });
        expiration = sessionExpiration;
        sessionStorage.removeItem('session_expiration');
        email = sessionStorage.getItem('user_email') || '';
        name = sessionStorage.getItem('user_name') || '';
    }
}

// export interface IGatewayService {
//     getSite(): Promise<string>;
//     getUser(email: string, name: string): Promise<UserEmail>;
//     createUser(
//         email: string,
//         name: string,
//         password: string
//     ): Promise<DefaultResponse>;
//     confirmEmail(email: string, token: string): Promise<DefaultResponse>;
//     generateToken(email: string, password: string): Promise<UserToken>;
//     validateToken(): Promise<string>;
// }

export interface TokenValidationResult extends UserRole {
    expiration: string;
}

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
        return this.http.get('/api/health', { responseType: 'text' }).pipe(timeout(TimeoutSeconds * 1000));
    }

    get(): Observable<{ key: string }> {
        if (!localStorage.getItem('api_key')) {
            return this.http.get('/api/gateway').pipe(
                timeout(TimeoutSeconds * 1000),
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
        const tokens = getTokens();
        loadLoginSession();
        if (!tokens.access) {
            console.warn('No tokens found in session storage');
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
                console.log('Token validation response:', res);
                console.log('Token expiration header:', res.headers.get('x-token-expiration'));

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
    getUser(email: string, name: string): Promise<UserEmail> {
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

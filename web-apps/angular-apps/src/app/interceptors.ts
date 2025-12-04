import { HttpInterceptorFn } from '@angular/common/http';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
    let newReq = req.clone();
    newReq = newReq.clone({
        headers: newReq.headers.set('X-API-Key', localStorage.getItem('api_key') || ''),
    });

    newReq = newReq.clone({
        headers: newReq.headers.set('X-API-Version', 'v1'),
    });
    
    const access: string = localStorage.getItem(`user_access_token`) ?? '';
    const refresh: string = localStorage.getItem(`user_refresh_token`) ?? '';

    if (access) {
        newReq = newReq.clone({
            headers: newReq.headers.set('Authorization', `Bearer ${access}`),
        });
    }

    if (refresh) {
        newReq = newReq.clone({
            headers: newReq.headers.set('x-refresh-token', refresh)
        });
    }

    return next(newReq);
};
import { HttpInterceptorFn } from '@angular/common/http';
import { getTokens } from '@shared/utils';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
    let newReq = req.clone();
    newReq = newReq.clone({
        headers: newReq.headers.set('X-API-Key', localStorage.getItem('api_key') || ''),
    });

    newReq = newReq.clone({
        headers: newReq.headers.set('X-API-Version', 'v1'),
    });
    
    const tokens = getTokens();
    if (tokens.access) {
        newReq = newReq.clone({
            headers: newReq.headers.set('Authorization', `Bearer ${tokens.access}`),
        });
    }

    if (tokens.refresh) {
        newReq = newReq.clone({
            headers: newReq.headers.set('x-refresh-token', tokens.refresh)
        });
    }

    return next(newReq);
};
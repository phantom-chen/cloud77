import { HttpInterceptorFn } from '@angular/common/http';
import { apiKey, getTokens } from '@shared/storages';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
    let newReq = req.clone();
    newReq = newReq.clone({
        headers: newReq.headers.set('X-API-Key', apiKey()),
    });

    newReq = newReq.clone({
        headers: newReq.headers.set('X-API-Version', 'v1'),
    });
    
    const tokens = getTokens('local');
    if (tokens.access) {
        newReq = newReq.clone({
            headers: newReq.headers.set('Authorization', `Bearer ${tokens.access}`),
        });
    }

    // if (refresh) {
    //     newReq = newReq.clone({
    //         headers: newReq.headers.set('x-refresh-token', refresh)
    //     });
    // }

    return next(newReq);
};
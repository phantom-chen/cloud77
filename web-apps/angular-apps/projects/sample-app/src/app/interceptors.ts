import { HttpInterceptorFn } from '@angular/common/http';

export const SimpleInterceptor: HttpInterceptorFn = (req, next) => {
    let newReq = req.clone();
    newReq = newReq.clone({
        headers: newReq.headers.set('X-API-Key', localStorage.getItem('api_key') || ''),
    });

    newReq = newReq.clone({
        headers: newReq.headers.set('X-API-Version', 'v1'),
    });

    return next(newReq);
};
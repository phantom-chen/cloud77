import { HttpInterceptorFn } from '@angular/common/http';
import { apiKey } from '@shared/storages';

export const SimpleInterceptor: HttpInterceptorFn = (req, next) => {
    let newReq = req.clone();
    newReq = newReq.clone({
        headers: newReq.headers.set('X-API-Key', apiKey()),
    });

    newReq = newReq.clone({
        headers: newReq.headers.set('X-API-Version', 'v1'),
    });

    return next(newReq);
};
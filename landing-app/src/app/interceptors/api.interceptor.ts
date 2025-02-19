// import { HttpInterceptorFn } from '@angular/common/http';
// import { getAuthorization, getKey, getRefreshToken } from './storage';

// export const apiInterceptor: HttpInterceptorFn = (req, next) => {
//     let newReq = req.clone();
//     if (getKey()) {
//         newReq = newReq.clone({
//             headers: newReq.headers.set('X-API-Key', getKey())
//         });
//     }

//     if (getAuthorization()) {
//         newReq = newReq.clone({
//             headers: newReq.headers.set('Authorization', getAuthorization()),
//         });
//     }

//     if (getRefreshToken()) {
//         newReq = newReq.clone({
//             headers: newReq.headers.set('x-refresh-token', getRefreshToken())
//         });
//     }
//     return next(newReq);
// };

export {}
import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  let newReq = req.clone();
  if (localStorage.getItem('apikey')) {
    newReq = newReq.clone({
      headers: newReq.headers.set('X-API-Key', `${localStorage.getItem('apikey')}`)
    });
  }
  if (localStorage.getItem('accessToken')) {
    newReq = newReq.clone({
      headers: newReq.headers.set('Authorization', `Bearer ${localStorage.getItem('accessToken')}`),
    });
  }
  if (localStorage.getItem('refreshToken')) {
    newReq = newReq.clone({
      headers: newReq.headers.set('x-refresh-token', `${localStorage.getItem('refreshToken')}`)
    });
  }
  return next(newReq);
};

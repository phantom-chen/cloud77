import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  let newReq = req.clone();
  if (localStorage.getItem('apikey')) {
    newReq = newReq.clone({
      headers: newReq.headers.set('X-API-Key', `${localStorage.getItem('apikey')}`)
    });
  }
  if (sessionStorage.getItem('accessToken')) {
    newReq = newReq.clone({
      headers: newReq.headers.set('Authorization', `Bearer ${sessionStorage.getItem('accessToken')}`),
    });
  }
  if (sessionStorage.getItem('refreshToken')) {
    newReq = newReq.clone({
      headers: newReq.headers.set('x-refresh-token', `${sessionStorage.getItem('refreshToken')}`)
    });
  }
  return next(newReq);
};

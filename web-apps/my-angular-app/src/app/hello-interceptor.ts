import { HttpInterceptorFn } from '@angular/common/http';

export const helloInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(req.url);
  return next(req);
};

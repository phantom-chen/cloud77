import { HttpInterceptorFn } from '@angular/common/http';

export const testerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

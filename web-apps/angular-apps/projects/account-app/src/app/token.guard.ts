import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const TokenGuard: CanActivateFn = (route, state) => {

  // console.log('tokenGuard called');
  // console.log(location);
  // console.log(route);
  // console.log(route.url);
  // console.log(state.url);

  const router = inject(Router);
  // const authService = inject(AuthenticationService);
  // inject http client

  // get the SSO endpoint
  // check if token is valid

  // if (!authService.isLoggedIn()) {
  //   const loginPath = router.parseUrl("/login");
  //   return new RedirectCommand(loginPath, {
  //     skipLocationChange: "true",
  //   });
  // }

  // return true

  try {
    return true;
  } catch (error) {
    if (error instanceof HttpErrorResponse) {
      const response = error as HttpErrorResponse;
      console.error(error);
      if (response.status === 401) {
        router.navigateByUrl('un-authorized?href=abcd');
        return false;
      }
    }
    return false;
  }
};

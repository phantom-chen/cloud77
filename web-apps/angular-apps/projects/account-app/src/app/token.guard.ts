import { CanActivateFn } from '@angular/router';

export const TokenGuard: CanActivateFn = (route, state) => {

  // console.log('tokenGuard called');
  // console.log(location);
  // console.log(route);
  // console.log(route.url);
  // console.log(state.url);

  // const router = inject(Router);
  // const authService = inject(AuthenticationService);

  // if (!authService.isLoggedIn()) {
  //   const loginPath = router.parseUrl("/login");
  //   return new RedirectCommand(loginPath, {
  //     skipLocationChange: "true",
  //   });
  // }

  // return true

  return true;
};

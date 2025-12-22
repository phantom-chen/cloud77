import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const KeyGuard: CanActivateFn = (route, state) => {
    // check the api key validity
    return true;
}
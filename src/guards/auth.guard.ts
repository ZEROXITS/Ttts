
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  // Fix: Explicitly type the router to resolve the 'unknown' type error.
  const router: Router = inject(Router);

  if (authService.currentUser()) {
    return true;
  }

  // Redirect to the login page
  return router.parseUrl('/login');
};

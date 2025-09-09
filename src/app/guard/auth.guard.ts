import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // فقط در مرورگر چک کن
  if (typeof window === 'undefined') return false;

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/auth']); // هدایت به صفحه لاگین
    return false;
  }
};

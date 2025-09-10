import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // اگر لاگین نبود یا توکن منقضی شده بود
  if (authService.isLoggedIn()) {
    return true;
  } else {
    authService.logout(); // پاک کردن توکن
    router.navigate(['/auth']); // ریدایرکت به صفحه ورود
    return false;
  }
};

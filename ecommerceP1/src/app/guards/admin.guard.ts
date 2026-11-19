
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { firstValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async () => {
  const adminAuth = inject(AdminAuthService);
  const router = inject(Router);

  try {
    const admin = await firstValueFrom(adminAuth.checkSession());

    if (admin?.role === 'ADMIN') {
      return true;
    }

    return router.createUrlTree(['/']);
  } catch {
    return router.createUrlTree(['/']);
  }
};

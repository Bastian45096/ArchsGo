import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const raw = localStorage.getItem('user');
  if (raw) {
    try {
      const user = JSON.parse(raw);
      if (user.userId) {
        const cloned = req.clone({
          setHeaders: {
            'X-User-Id': String(user.userId),
            'X-Username': user.username || ''
          }
        });
        return next(cloned);
      }
    } catch {}
  }
  return next(req);
};
import { CanMatchFn } from '@angular/router';

export const roleGuard: CanMatchFn = (route, segments) => {
  return true;
};

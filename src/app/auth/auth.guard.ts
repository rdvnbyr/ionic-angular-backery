import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.getUserIsAuthenticated.pipe(
      take(1),
      switchMap((isAuth) => {
        if (!isAuth) {
          return this.authService.checkAuthentication();
        } else {
          return of(isAuth);
        }
      }),
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}

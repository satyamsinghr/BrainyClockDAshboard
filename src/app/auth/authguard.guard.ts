import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
 import { Logger } from '../@shared/logger.service';
 import { AuthService } from './auth.service';
import { CredentialsService } from './credentials.service';
const log = new Logger('AuthenticationGuard');
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /**
   *
   */
  constructor(private router: Router,private authService:AuthService, private credentialsService:CredentialsService) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (true) {
        return true;
      } else {
        log.debug('Not authenticated, redirecting and adding redirect url...');
        this.router.navigate(['/login'], { queryParams: { redirect: state.url }, replaceUrl: true });
        return false;
    }
  }
}

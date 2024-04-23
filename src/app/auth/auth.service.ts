import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';

//import { config } from '../config';
import { Credentials, loginDto } from '../@shared/models/auth.model';
import { CredentialsService } from './credentials.service';
import { Router } from '@angular/router';
//import { TokenCredentials } from '../@shared/models/user.model';
import { Logger } from '../@shared/logger.service';
//mport { AppService } from '../app.service';
import {environment} from '../../environments/environment';
const log = new Logger('RefreshToken');
const baseUrl="/User";
const Routes = {
  login: `${baseUrl}/Login`,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // public apiConfig=environment.base_url;
  // user=new BehaviorSubject<loginDto>(null);
 // public apiConfig:string=config.API_URL;
  constructor(private httpClient: HttpClient,private credentialsService: CredentialsService, private routes :Router) { }
 /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  // login(context: loginDto): Observable<Credentials> {
  //   return this.httpClient.post<Credentials>(this.apiConfig+Routes.login, context);
  // }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    //Clearing localStorage
    localStorage.removeItem('role');
    localStorage.removeItem('credentials');
    localStorage.removeItem('order');
    localStorage.removeItem('combo-order');
    localStorage.removeItem('ccount');
    localStorage.removeItem('userId');
    localStorage.removeItem('SchudleGetData');
    sessionStorage.removeItem('credentials');
    sessionStorage.removeItem('storeStartTime');
    sessionStorage.removeItem('storeCloseTime');
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }

  /**
   * Gets the jwt token from crendential service
   */
  public getJwtToken() {
    return this.credentialsService.jwtToken;
  }
  /**
   * Stores the new token into storage
   */
  // private storeJwtToken(credentials: any) {
  //   this.credentialsService.setRefreshTokenCredentials(credentials);
  // }


   /**
   * Gets the Refresh token from crendential service
   */

}

import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Credentials } from '../@shared/models/auth.model';
import { jwtDecode } from '../helpers/jwt-decode';
import jwt_decode from "jwt-decode";
const credentialsKey = 'credentials';
@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  private _credentials: Credentials | null = null;

  constructor() {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  userActivated(value: boolean) {
    this.status.next(value);
  }

  // isTokenExpired(): boolean {
  //   let expiryToken: any;
  //   if ((typeof this._credentials != 'undefined') && (this._credentials!=null)) {
  //     expiryToken = this.jwtDecoded;
  //     let date = new Date();
  //     const isExpired = expiryToken.exp;
  //     const currentDate = this.toTimestamp(date);
  //     if (isExpired.valueOf() > currentDate.valueOf()) return false;
  //     else return true;
  //   }
  //   else return false;
  // }

  toTimestamp(strDate: any) {
    var datum = Date.parse(strDate);
    return datum / 1000;
  }

  get UserIsActivated() {
    return this.status.value;
  }
  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Gets the Display Name from the LoggedIn user
   * @returns The Display Name or null
   */
  // get displayName(): string | null {
  //   return this._credentials.data.roles ? this._credentials.data.roles[0] : null;
  // }

  /**
   * Gets the Display Name from the LoggedIn user
   * @returns The Display Name or null
   */
  // get userId(): number | 0 {
  //   return this._credentials.data.id ? Number(this._credentials.data.id) : 0;
  // }

  /**
   * Gets the userEmail from the LoggedIn user
   * @returns The User Email or null
   */
  // get userEmail(): string | null {
  //   return this._credentials.data.email ? this._credentials.data.email : null;
  // }

  // get userName(): string | null {
  //   return this._credentials.data.name ? this._credentials.data.name : null;
  // }


  /**
   * Gets the company Name from the LoggedIn user
   * @returns The Company Name or null
   */
  // get userLoginPic(): string {
  //   return this._credentials.data.profileImage ? this._credentials.data.profileImage : null;
  // }


  /**
   * Gets the jwt token from the localStorage
   * @returns The token or null if not found
   */
  get jwtToken() {
    const token = JSON.parse(sessionStorage['credentials']).token;
    return token ? token : null;
  }

  /**
   * Decode the token stored in the credentials
   * @returns object containing decoded token.
   */
  // get jwtDecoded() {
  //   const token = this._credentials;
  //   var decoded = jwt_decode(token.token);
  //   return decoded;
  // }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      // const storage = localStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
  /**
  * Sets the user credentials on Token Refresh.
  * @param credentials The token credentials.
  * @returns null
  */
  // setRefreshTokenCredentials(credentials: any) {
  //   let userDetail = JSON.parse(localStorage.getItem('credentials'));
  //   userDetail.data.token = credentials.token;
  //   userDetail.data.refreshToken = credentials.refreshToken;
  //   userDetail.data.tokenExpirty = credentials.tokenExpirty;
  //   this.setCredentials(userDetail);
  // }

}



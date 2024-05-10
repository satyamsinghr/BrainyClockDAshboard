import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private authServicce:AuthService, private router:Router, private toastr: ToastrService,) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { token } = JSON.parse(sessionStorage.getItem('credentials') || localStorage.getItem('credentials') || '{}');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request).pipe(

      catchError((err) => {
        if (err.status === 401) {
          //this.authServicce.logout();
          err.statusText="Unauthorized";
          // this.toastr.warning(err.statusText);
        }
        if(err.status === 404){
         // this.authServicce.logout();
          err.statusText="Not Found";
          // this.toastr.warning(err.statusText);
        }
        if(err.status===500){
         // this.authServicce.logout();
          err.statusText="Internal Server Error";
          // this.toastr.warning(err.statusText);
        }
        let error ;
        if(error==null) error=err;
        else error== err.message || err.statusText;
        return throwError(error);
      })
    );
  }
}


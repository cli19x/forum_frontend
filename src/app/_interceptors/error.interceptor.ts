import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthService} from '../_services';
import {NotificationService} from '../_services';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService, private notif: NotificationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].indexOf(err.status) !== -1) {
                if (!localStorage.getItem('currentUser')) {
                  this.authenticationService.logout();
                  return throwError('Login error: incorrect email or password');
                } else {
                  this.authenticationService.logout();
                  return throwError('Session has expired, please sign in again');
                }
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}

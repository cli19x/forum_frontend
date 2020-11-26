import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService,
                ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        console.log(request);
        const jwt = JSON.parse(localStorage.getItem('JWT'));
        console.log(jwt);
        if (jwt) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${jwt.token}`
                }
            });
        }
       // console.log('JWT Interceptor request:', request);
        return next.handle(request);
    }
}

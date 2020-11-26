import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService} from '../_services/auth.service';
import {NotificationService} from '../_services/notification.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService,
        private notify: NotificationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentJWTValue;
        console.log(this.authenticationService.currentJWTValue);
        if (currentUser === undefined) {
            // check if route is restricted by role
            console.log('last role');
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        // not logged in so redirect to login page with the return url
        return true;
    }
}

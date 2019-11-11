import { Component } from '@angular/core';
import {NotificationService} from './_services';
import {AuthService} from './_services';
import {Router} from '@angular/router';
import {User} from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AdHoc';
  currentUser: User;


  constructor(private router: Router,
              private authService: AuthService,
              private notif: NotificationService
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  get isUser() {
    return this.currentUser;
  }

  logout() {
    this.authService.logout();
    console.log('hahaha1');
    this.router.navigate(['/login']);
  }

}


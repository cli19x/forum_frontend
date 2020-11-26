import {Component, OnInit} from '@angular/core';
import {AuthService} from './_services';
import {Router} from '@angular/router';
import {UserInfo} from './_models/userInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Group Raiser';
  currentUser: UserInfo;
  avatar: any;
  data: any;

  constructor(private router: Router,
              private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
  }

  get isUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (localStorage.getItem('image')) {
      const imageData = JSON.parse(localStorage.getItem('image'));
      imageData ? this.avatar = imageData.avatar :
        this.avatar = 'https://group-raiser-angular.s3.amazonaws.com/assets/test.jpg';
    } else {
      this.avatar = 'https://group-raiser-angular.s3.amazonaws.com/assets/test.jpg';
    }
    return this.currentUser;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(res => {
      console.log(res);
    });
  }

}


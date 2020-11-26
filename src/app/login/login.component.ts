import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService, NotificationService, UserService} from '../_services';
import {Observable} from 'rxjs';
import {ResponseObject} from '../_models/responseObject';
import {JwtToken} from '../_models/jwtToken';
import {AppComponent} from '../app.component';
import {first} from 'rxjs/operators';
import {UserInfo} from '../_models/userInfo';
import {UserImage} from '../_models/userImage';

@Component({ templateUrl: 'login.component.html' ,
  styleUrls: ['login.component.css']})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  public currentUser: Observable<ResponseObject>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationService
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']).then(r => console.log(r));
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  // convenience getter for easy access to form fields//346947  286166
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(this.f.username.value, this.f.password.value)
      .subscribe(user => {
          const token = user.headers.get('Authorization');
          if (!user.ok) {
            this.notification.showNotif(`Login error: Unable to login`, 'error');
            this.loading = false;
          } else if (user.ok) {
            const jwt: JwtToken = {
              token
            };
            localStorage.setItem('JWT', JSON.stringify(jwt));
          }
        },
        error => {
          this.notification.showNotif(`Login error: ${error}`, 'error');
          this.loading = false;
        }, () => {
          const info = this.getDecodedAccessToken(localStorage
            .getItem('JWT').replace('Bearer ', ''));
          this.getUserInfo(info.sub);
        }
      );

  }

  getUserInfo(username: string) {
    let user: UserInfo;
    this.authService.userInfo(username)
      .subscribe(info => {
        const responseObject: ResponseObject = info;
        if (responseObject.errMsg) {
          this.notification.showNotif(`Login error: ${responseObject.errMsg}`, 'error');
          this.loading = false;
        } else if (responseObject.msg) {
          user = responseObject.objects as UserInfo;
        }
        }, error => {
          this.notification.showNotif(`Login error: ${error}`, 'error');
          this.loading = false;
        }, () => {
          this.getAvatar(user);
        }
      );
  }

  getAvatar(user: UserInfo) {
    if (!user.avatarKey) {
      this.getBackground(user, null);
      return;
    }
    let objectURL;
    this.userService.downloadUserAvatar(user.uid)
      .pipe(first())
      .subscribe(data => {
          const responseObject: ResponseObject = data;
          if (responseObject.errMsg) {
            this.loading = false;
          } else if (responseObject.msg) {
            objectURL = 'data:image/jpeg;base64,' + responseObject.objects;
          }
        }, error => {
          console.log(error);
        }, () => {
          this.getBackground(user, objectURL);
        }
      );
  }

  getBackground(user: UserInfo, avData: any) {
    if (!user.backgroundKey) {
      if (avData) {
        const img: UserImage = {
          avatar: avData,
          background: null
        };
        localStorage.setItem('image', JSON.stringify(img));
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/']).then(res => {
        console.log(res);
      });
      return;
    }
    this.userService.downloadUserBackground(user.uid)
      .pipe(first())
      .subscribe(data => {
          const responseObject: ResponseObject = data;
          if (responseObject.errMsg) {
            this.loading = false;
          } else if (responseObject.msg) {
            const objectURL = 'data:image/jpeg;base64,' + responseObject.objects;
            const img: UserImage = {
              avatar: avData,
              background: objectURL
            };
            localStorage.setItem('image', JSON.stringify(img));
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log(localStorage.getItem('currentUser'));
            this.loading = false;
          }
        }, error => {
          console.log(error);
        }, () => {
          this.router.navigate(['/']).then(res => {
            console.log(res);
          });
        }
      );
  }


  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}

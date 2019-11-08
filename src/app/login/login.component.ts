import {Component, OnInit} from '@angular/core';
import { first } from 'rxjs/operators';

import {ActivatedRoute, Router} from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService, NotificationService} from '../_services';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../_models/user';


@Component({ templateUrl: 'login.component.html' ,
  styleUrls: ['login.component.css']})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notification: NotificationService,
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
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
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.notification.showNotif('Submit clicked', 'confirm');
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(user => {
          console.log('response', user);
          const {msg, errMsg} = user;
          if (errMsg) {
            console.log('login failed');
            this.notification.showNotif(`Login error: ${errMsg}`, 'confirm');
            this.loading = false;
          } else if (msg) {
            console.log(msg);
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log(JSON.stringify(user));
            this.authService.currentUserM.next(user);
            this.loading = false;
            this.router.navigate([this.returnUrl]).then(res => {console.log(res);
            });
          }
        },
        error => {
          this.notification.showNotif(`Login error: ${error}`, 'confirm');
          this.loading = false;
        }
      );
  }
}

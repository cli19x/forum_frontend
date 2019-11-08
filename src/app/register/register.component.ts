import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { NotificationService } from '../_services';
import { UserService } from '../_services';
import { AuthService } from '../_services';

@Component({templateUrl: 'register.component.html',
  styleUrls: ['register.component.css']

})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  roles = [];


  constructor(
    // private patternValidator: PatternValidator,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationService
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    const regularPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const regularExpression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      eMail: ['', [Validators.required, Validators.pattern(regularPattern)]],
      nickName: ['', [Validators.required]],
      passwd: ['', [Validators.required, Validators.pattern(regularExpression)]]

    });

    this.roles = [{name: 'Student'},
      {name: 'Professor'}];
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('Error in onSubmit()');
      return;
    }

    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(reg => {
          console.log('response', reg);
          const {msg, errMsg} = reg;
          if (errMsg) {
            console.log('login failed');
            this.notification.showNotif(`Register error: ${errMsg}`, 'confirm');
            this.loading = false;
          } else if (msg) {
            this.loading = false;
            this.notification.showNotif(`Register success!!!`, 'Yeaaaaaah');
            this.router.navigate(['/login']).then(res => {console.log(res);
            });
          }
        },
        error => {
          this.notification.showNotif(`Register error: ${error}`, 'confirm');
          this.loading = false;
        }
      );
  }
}

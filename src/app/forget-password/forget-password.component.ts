import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';

import { NotificationService } from '../_services';
import { UserService } from '../_services';
import { AuthService } from '../_services';
import {ResponseObject} from '../_models/responseObject';

@Component({templateUrl: 'forget-password.component.html',
  styleUrls: ['forget-password.component.css']

})
export class ForgetPasswordComponent implements OnInit {
  forgetForm: FormGroup;
  loading = false;
  submitted = false;
  sending = false;
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
      this.router.navigate(['/']).then(r => console.log(r));
    }
  }

  ngOnInit() {
    const regularPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const regularExpression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
    const codePattern = /^\d{7}$/;
    this.forgetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(regularPattern)]],
      vCode: ['', [Validators.required, Validators.pattern(codePattern)]],
      password: ['', [Validators.required, Validators.pattern(regularExpression)]],
      rePassword: ['', [Validators.required, Validators.pattern(regularExpression)]]
    }, {validator: twoPasswordAreEqual});

    this.roles = [{name: 'Student'},
      {name: 'Professor'}];
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgetForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.forgetForm.invalid) {
      console.log('Error in onSubmit()');
      return;
    }
    this.loading = true;
    this.userService.resetPassword(this.forgetForm.value)
      .pipe(first())
      .subscribe(reg => {
          console.log('response', reg);
          const responseObject: ResponseObject = reg;
          if (responseObject.errMsg) {
            console.log('login failed');
            this.notification.showNotif(`Reset password error: ${responseObject.errMsg}`, 'error');
            this.loading = false;
          } else if (responseObject.msg) {
            this.loading = false;
            this.notification.showNotif(`${responseObject.msg}`, 'confirm');
          }
        },
        error => {
          this.notification.showNotif(`Reset password error: ${error}`, 'error');
          this.loading = false;
        }, () => {
          this.router.navigate(['/login']).then(res => {
            console.log(res);
          });
        }
      );
  }

  sendCode() {
    this.sending = true;
    console.log(this.forgetForm.value.email);
    this.userService.getVerifyCode(this.forgetForm.value.email)
      .subscribe(reset => {
          console.log('response', reset);
          const responseObject: ResponseObject = reset;
          if (responseObject.errMsg) {
            this.notification.showNotif(`Reset password error: ${responseObject.errMsg}`, 'error');
            this.sending = false;
          } else if (responseObject.msg) {
            this.notification.showNotif(`${responseObject.msg}`, 'confirm');
            this.sending = false;
          }
        },
        error => {
          this.notification.showNotif(`Register error: ${error}`, 'confirm');
          this.sending = false;
        }
      );
  }
}

export function twoPasswordAreEqual(c: AbstractControl) {
  if (c.get('password').value === c.get('rePassword').value) {
    return c.get('rePassword').setErrors(null);
  } else {
    return c.get('rePassword').setErrors({ invalidEndDate: true });
  }
}

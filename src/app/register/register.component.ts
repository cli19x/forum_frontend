import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AuthService, NotificationService, UserService} from '../_services';
import {ResponseObject} from '../_models/responseObject';

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
      this.router.navigate(['/']).then(r => console.log(r));
    }
  }

  ngOnInit() {
    const regularPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const regularExpression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.pattern(regularPattern)]],
      nickname: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(regularExpression)]],
      rePassword: ['', [Validators.required, Validators.pattern(regularExpression)]]
    }, { validator: twoPasswordAreEqual});

    this.roles = [{name: 'Student'},
      {name: 'Professor'}];
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

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
          const responseObject: ResponseObject = reg;
          if (responseObject.errMsg) {
            console.log('login failed');
            this.notification.showNotif(`Register error: ${responseObject.errMsg}`, 'confirm');
            this.loading = false;
          } else if (responseObject.msg) {
            this.loading = false;
            this.notification.showNotif(`Register success!!!`, 'Yeaaaaaah');
            this.router.navigate(['/login']).then(res => {
              console.log(res);
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
export function twoPasswordAreEqual(c: AbstractControl) {
  if (c.get('password').value === c.get('rePassword').value) {
    return c.get('rePassword').setErrors(null);
  } else {
    return c.get('rePassword').setErrors({ invalidEndDate: true });
  }
}

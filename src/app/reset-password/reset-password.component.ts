import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService, NotificationService} from '../_services';
import {first} from 'rxjs/operators';

@Component({
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetFrom: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notification: NotificationService
  ) {
  }

  ngOnInit() {
    this.resetFrom = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  // convenience getter for easy access to form fields//346947  286166
  get f() { return this.resetFrom.controls; }


  onSubmit() {
    // this.notification.showNotif('Submit clicked', 'confirm');
    // this.submitted = true;
    //
    // // stop here if form is invalid
    // if (this.resetFrom.invalid) {
    //   return;
    // }
    //
    // this.loading = true;
    // console.log('one');
    // this.authService.login(this.f.username.value, this.f.password.value)
    //   .pipe(first())
    //   .subscribe(
    //     data => {
    //       console.log('one');
    //       this.router.navigate([this.returnUrl]);
    //     },
    //     error => {
    //       console.log('one');
    //       this.error = error;
    //       this.loading = false;
    //       this.submitted = false;
    //       // show a snackbar to user
    //       this.notification.showNotif(this.error, 'undo');
    //     });
    console.log('submit');
  }

}

import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { IndexComponent } from './index/index.component';


import {MaterialModule} from './material-module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegisterComponent } from './register/register.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './_interceptors/jwt.interceptor';
import {ErrorInterceptor} from './_interceptors/error.interceptor';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { TopicComponent } from './topic/topic.component';
import {GalleryModule} from 'ng-gallery';
import {NgImageSliderModule} from 'ng-image-slider';
import {SlideshowModule} from 'ng-simple-slideshow';
import { ProfileComponent } from './profile/profile.component';
import {NgMarqueeModule} from 'ng-marquee';
import { MyCommentsComponent } from './my-comments/my-comments.component';
import { MyTopicsComponent } from './my-topics/my-topics.component';
import { CommentComponent } from './comment/comment.component';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material';
import { DetailPageComponent } from './detail-page/detail-page.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {SidebarModule} from 'ng-sidebar';
import { OtherProfileComponent } from './other-profile/other-profile.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { MyRepliesComponent } from './my-replies/my-replies.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ForgetPasswordComponent,
    TopicComponent,
    IndexComponent,
    ProfileComponent,
    MyCommentsComponent,
    MyTopicsComponent,
    CommentComponent,
    DetailPageComponent,
    ConfirmationDialogComponent,
    OtherProfileComponent,
    AboutUsComponent,
    MyRepliesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GalleryModule.forRoot(),
    NgImageSliderModule,
    SlideshowModule,
    NgMarqueeModule,
    MatDialogModule,
    SidebarModule.forRoot(),
    BsDropdownModule.forRoot(),
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    DatetimePopupModule.forRoot()
  ],
  entryComponents: [ConfirmationDialogComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }

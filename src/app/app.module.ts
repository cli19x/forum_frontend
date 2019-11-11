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
import { ChoosingPreferencesComponent } from './choosing-preferences/choosing-preferences.component';
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
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { DetailPageComponent } from './detail-page/detail-page.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {SidebarModule} from 'ng-sidebar';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ChoosingPreferencesComponent,
    ForgetPasswordComponent,
    TopicComponent,
    IndexComponent,
    ProfileComponent,
    MyCommentsComponent,
    MyTopicsComponent,
    CommentComponent,
    ProfileDialogComponent,
    DetailPageComponent,
    ConfirmationDialogComponent,
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
    SidebarModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }

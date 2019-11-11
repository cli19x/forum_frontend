
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthGuard} from './_guards/auth.guard';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {ProfileComponent} from './profile/profile.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DetailPageComponent} from './detail-page/detail-page.component';


// , canActivate: [AuthGuard]
const routes: Routes = [{path: '', component: HomeComponent, canActivate: [AuthGuard] }, {path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },
  {path: 'reset_password', component: ResetPasswordComponent, canActivate: [AuthGuard]},
  {path: 'forget_password', component: ForgetPasswordComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'topic', component: DetailPageComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ''}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { ResponseObject } from '../_models/responseObject';
import {UpdateSignature} from '../_models/updateSignature';
import {UpdatePassword} from '../_models/updatePassword';
import {ResetPassword} from '../_models/resetPassword';




@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {
  }

  register(user: ResponseObject) {
    return this.http.post<any>(`http://localhost:8080/user/register`, user);
  }

  updateSignature(signature: UpdateSignature) {
    return this.http.put<any>(`http://localhost:8080/user/api/update-personal-signature`,
      signature);
  }

  updatePassword(password: UpdatePassword) {
    return this.http.put<any>(`http://localhost:8080/user/api/update-password`,
      password);
  }

  getVerifyCode(email: string) {
    return this.http.get<any>(`http://localhost:8080/user/forget-case?email=${email}`);
  }

  resetPassword(resetPassword: ResetPassword) {
    return this.http.post<any>(`http://localhost:8080/user/forget-password`, resetPassword);
  }

  getUserProfile(uid: string) {
    return this.http.get<any>(`http://localhost:8080/user/api/${uid}`);
  }

  uploadUserAvatar(uid: string, file: FormData) {
    return this.http.post<any>(`http://localhost:8080/user/api/avatar/upload?uid=${uid}`, file);
  }

  uploadUserBackground(uid: string, file: FormData) {
    return this.http.post<any>(`http://localhost:8080/user/api/background/upload?uid=${uid}`, file);
  }

  downloadUserAvatar(uid: string) {
    return this.http.get<any>(`http://localhost:8080/user/api/avatar/download/${uid}`);

  }

  downloadUserBackground(uid: string) {
    return this.http.get<any>(`http://localhost:8080/user/api/background/download/${uid}`);
  }


}

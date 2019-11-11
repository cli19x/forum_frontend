
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { User } from '../_models/user';
import {Post} from '../_models/post';




@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post<any>(`http://end.greatbestus.com:8080/register`, user);
  }

  updateStatus(status: Post) {
    return this.http.post<any>(`http://end.greatbestus.com:8080/setPS`, status);
  }

  updateProfile(user: User) {
    return this.http.post<any>(`http://end.greatbestus.com:8080/getUserProfile`, user.token);
  }
}


import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { User } from '../_models/user';




@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post<any>(`http://end.greatbestus.com/register`, user);
  }

}

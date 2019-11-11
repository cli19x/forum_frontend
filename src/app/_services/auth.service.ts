import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject,  Observable} from 'rxjs';
import { User } from '../_models/user';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentUserM(): BehaviorSubject<User> {
    return this.currentUserSubject;
  }

  login(username: string, password: string) {
    let params = new HttpParams();
    params = params.append('email', username);
    params = params.append('passwd', password);
    return this.http.get<any>(`http://end.greatbestus.com:8080/login`, {params});
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}

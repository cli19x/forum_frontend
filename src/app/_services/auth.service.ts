import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject,  Observable} from 'rxjs';
import {UserInfo} from '../_models/userInfo';
import {LoginObject} from '../_models/loginObject';
import {JwtToken} from '../_models/jwtToken';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly currentUserSubject: BehaviorSubject<UserInfo>;
  public currentUser: Observable<UserInfo>;
  private readonly currentJWTSubject: BehaviorSubject<JwtToken>;
  public currentJWT: Observable<JwtToken>;
  private readonly currentImageSubject: BehaviorSubject<JwtToken>;
  public currentImage: Observable<JwtToken>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserInfo>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentJWTSubject = new BehaviorSubject<JwtToken>(JSON.parse(localStorage.getItem('JWT')));
    this.currentJWT = this.currentJWTSubject.asObservable();
    this.currentImageSubject = new BehaviorSubject<JwtToken>(JSON.parse(localStorage.getItem('image')));
    this.currentImage = this.currentJWTSubject.asObservable();
  }

  public get currentUserValue(): UserInfo {
    return this.currentUserSubject.value;
  }

  public get currentJWTValue(): JwtToken {
    return this.currentJWTSubject.value;
  }

  login(username: string, password: string) {
    const loginObject: LoginObject = {
      username,
      password
    };
    return this.http.post<any>(`http://localhost:8080/login`, loginObject,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        observe: 'response'
      });
  }

  userInfo(username: string) {
    return this.http.get<any>(`http://localhost:8080/user/api/email/${username}`);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.currentJWTSubject.next(null);
    this.currentImageSubject.next(null);
  }
}

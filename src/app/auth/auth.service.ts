/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { Storage } from '@capacitor/storage';

// https://firebase.google.com/docs/reference/rest/auth
// https://academind.com/tutorials/understanding-rxjs
interface AuthFirebaseRespond {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

interface StoredData {
  email: string;
  userId: string;
  token: string;
  tokenExpTime: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private user = new BehaviorSubject<User>(null);
  private logoutTimer: any;
  constructor(private router: Router, private http: HttpClient) {}

  get getUserIsAuthenticated() {
    return this.user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get getUserId() {
    return this.user
      .asObservable()
      .pipe(map((user) => (user ? user.id : null)));
  }

  ngOnDestroy(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  checkAuthentication() {
    return from(Storage.get({ key: 'crafts-unfolded' })).pipe(
      map((data) => {
        if (!data || !data.value) {
          return null;
        }
        const { token, userId, tokenExpTime, email }: StoredData = JSON.parse(
          data.value
        );
        const expTime = new Date(tokenExpTime);
        if (expTime <= new Date()) {
          return null;
        }
        const user = new User(userId, email, token, expTime);
        return user;
      }),
      tap((user) => {
        if (user) {
          this.user.next(user);
          this.logoutUserIfTimeIsOut(user.tokenTimeout);
        }
      }),
      map((user) => !!user)
    );
  }

  logoutUserIfTimeIsOut(timeout: number) {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, timeout);
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthFirebaseRespond>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(tap(this.setAuthUser.bind(this)));
  }
  logout() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    Storage.remove({ key: 'crafts-unfolded' }).then(() => {
      this.user.next(null);
      this.router.navigateByUrl('/auth');
    });
  }
  signUp(email: string, password: string) {
    return this.http.post<AuthFirebaseRespond>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPiKey}`,
      { email, password, returnSecureToken: true }
    );
  }

  private setAuthUser(user: AuthFirebaseRespond) {
    const calculateTime = new Date(
      new Date().getTime() + +user.expiresIn * 1000
    );
    const newUser = new User(
      user.localId,
      user.email,
      user.idToken,
      calculateTime
    );
    this.user.next(newUser);
    this.logoutUserIfTimeIsOut(newUser.tokenTimeout);
    this.storeAuthenticatedUser(
      user.idToken,
      calculateTime.toISOString(),
      user.localId,
      user.email
    );
  }

  private storeAuthenticatedUser(
    token: string,
    tokenExpTime: string,
    userId: string,
    email: string
  ) {
    const value: StoredData = {
      userId,
      token,
      tokenExpTime,
      email,
    };
    Storage.set({
      key: 'crafts-unfolded',
      value: JSON.stringify(value),
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }
}

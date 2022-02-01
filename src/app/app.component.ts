import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authSubsciption: Subscription;
  private appIsSetted = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubsciption = this.authService.getUserIsAuthenticated.subscribe(
      (isAuth) => {
        if (!isAuth && this.appIsSetted !== isAuth) {
          this.router.navigateByUrl('/auth');
        }
        this.appIsSetted = isAuth;
      }
    );
  }
  ngOnDestroy(): void {
    if (this.authSubsciption) {
      this.authSubsciption.unsubscribe();
    }
  }
  onLogout() {
    this.authService.logout();
  }
}

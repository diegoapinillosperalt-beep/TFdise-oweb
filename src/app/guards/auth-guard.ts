import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
  }

  canActivate(): boolean {
    if (this.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/cliente/login']); // si no está logueado, redirige
      return false;
    }
  }
}

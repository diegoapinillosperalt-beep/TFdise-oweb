import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userEmail = new BehaviorSubject<string | null>(null);

  // observables para suscribirse desde componentes
  isLoggedIn$ = this.loggedIn.asObservable();
  userEmail$ = this.userEmail.asObservable();

  login(email: string) {
    this.loggedIn.next(true);
    this.userEmail.next(email);
    localStorage.setItem('userEmail', email); // persistencia
  }

  logout() {
    this.loggedIn.next(false);
    this.userEmail.next(null);
    localStorage.removeItem('userEmail');
  }

  checkLocalStorage() {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.loggedIn.next(true);
      this.userEmail.next(email);
    }
  }

  // ✅ getters sincronizados
  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  getUser(): string | null {
    return this.userEmail.value;
  }
}

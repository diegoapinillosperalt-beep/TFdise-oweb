import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userEmail = new BehaviorSubject<string | null>(null);
  private admin = new BehaviorSubject<boolean>(false);

  // observables
  isLoggedIn$ = this.loggedIn.asObservable();
  userEmail$ = this.userEmail.asObservable();
  isAdmin$ = this.admin.asObservable();

  // 🔥 usuarios fijos para prueba
  private usuarios = [
    { email: 'user@dbeny.com', password: '1234', isAdmin: false },
    { email: 'admin@dbeny.com', password: '1234', isAdmin: true }
  ];

  // auth.ts
login(email: string, password: string): boolean {
  const usuarios = [
    { email: 'user@dbeny.com', password: '1234', isAdmin: false },
    { email: 'admin@dbeny.com', password: '1234', isAdmin: true }
  ];

  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (usuario) {
    this.loggedIn.next(true);
    this.userEmail.next(usuario.email);
    this.admin.next(usuario.isAdmin);

    localStorage.setItem('userEmail', usuario.email);
    localStorage.setItem('isAdmin', usuario.isAdmin ? 'true' : 'false');
    return true;
  }

  return false;
}

  logout() {
    this.loggedIn.next(false);
    this.userEmail.next(null);
    this.admin.next(false);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
  }

  checkLocalStorage() {
    const email = localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (email) {
      this.loggedIn.next(true);
      this.userEmail.next(email);
      this.admin.next(isAdmin);
    }
  }

  // getters sincronizados
  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  getUser(): string | null {
    return this.userEmail.value;
  }

  isAdmin(): boolean {
    return this.admin.value;
  }
}

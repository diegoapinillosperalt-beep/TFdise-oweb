import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userEmail = new BehaviorSubject<string | null>(null);
  private userId = new BehaviorSubject<number | null>(null);
  private admin = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.loggedIn.asObservable();
  userEmail$ = this.userEmail.asObservable();
  userId$ = this.userId.asObservable();
  isAdmin$ = this.admin.asObservable();

  constructor() {
    this.checkLocalStorage();
  }

  setLogin(usuario: { idUsuario: number; email: string; isAdmin: boolean }) {
    if (!usuario || usuario.idUsuario == null) {
      console.error('setLogin: idUsuario no está definido', usuario);
      return;
    }

    this.loggedIn.next(true);
    this.userEmail.next(usuario.email);
    this.userId.next(usuario.idUsuario);
    this.admin.next(usuario.isAdmin);

    localStorage.setItem('userEmail', usuario.email);
    localStorage.setItem('userId', usuario.idUsuario.toString());
    localStorage.setItem('isAdmin', usuario.isAdmin ? 'true' : 'false');
  }

  logout() {
    this.loggedIn.next(false);
    this.userEmail.next(null);
    this.userId.next(null);
    this.admin.next(false);

    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
  }

  checkLocalStorage() {
    const email = localStorage.getItem('userEmail');
    const id = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (email && id) {
      this.loggedIn.next(true);
      this.userEmail.next(email);
      this.userId.next(+id);
      this.admin.next(isAdmin);
    }
  }

  getUserId(): number | null {
    return this.userId.value;
  }

  getUserEmail(): string | null {
    return this.userEmail.value;
  }

  isAdmin(): boolean {
    return this.admin.value;
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  getUser() {
  return {
    id: this.userId.value,
    email: this.userEmail.value,
    isAdmin: this.admin.value
  };
}

}

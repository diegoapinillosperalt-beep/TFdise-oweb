import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  template: `
    <div class="container mt-5" style="max-width: 400px;">
      <h2 class="mb-3">Iniciar Sesión</h2>
      <form (ngSubmit)="onLogin()">
        <input type="email" [(ngModel)]="email" name="email" placeholder="Correo" class="form-control mb-2" required>
        <input type="password" [(ngModel)]="password" name="password" placeholder="Contraseña" class="form-control mb-3" required>
        <button type="submit" class="btn btn-danger w-100">Ingresar</button>
      </form>

      <div *ngIf="errorMessage" class="text-danger mt-3">
        {{ errorMessage }}
      </div>
    </div>
  `
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const success = this.authService.login(this.email, this.password);

    if (success) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin/pedidos']); // 🔥 admin va directo al panel
      } else {
        this.router.navigate(['/']); // cliente normal al inicio
      }
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }
}

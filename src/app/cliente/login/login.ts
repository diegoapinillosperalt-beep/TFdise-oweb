import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container mt-5" style="max-width: 400px;">
      <h2 class="mb-3">Iniciar Sesión</h2>
      <form (ngSubmit)="onLogin()">
        <input type="email" [(ngModel)]="email" name="email" placeholder="Correo" class="form-control mb-2" required>
        <input type="password" [(ngModel)]="password" name="password" placeholder="Contraseña" class="form-control mb-3" required>
        <button type="submit" class="btn btn-danger w-100">Ingresar</button>
      </form>
    </div>
  `
})
export class Login {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    // Simulamos validación
    if (this.email && this.password) {
      this.authService.login(this.email);
      this.router.navigate(['/']); // redirige al inicio
    } else {
      alert('Por favor ingresa correo y contraseña');
    }
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  correo = '';
  contrasena = '';
  errorMessage = '';

  logoVisible: boolean = true;
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  onLogin() {
    const data = { correo: this.correo, contrasena: this.contrasena };

    this.http.post('http://localhost:3000/api/auth/login', data)
      .subscribe({
        next: (res: any) => {
          // Guardar idUsuario, email e isAdmin
          this.authService.setLogin({
            idUsuario: res.idUsuario,
            email: res.correo,
            isAdmin: res.isAdmin
          });

          // Redirigir según rol
          if (res.isAdmin) this.router.navigate(['/admin/pedidos']);
          else this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Usuario o contraseña incorrectos';
        }
      });
  }
}

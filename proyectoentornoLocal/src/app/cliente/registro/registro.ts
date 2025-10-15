import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  nombre = '';
  correo = '';
  contrasena = ''; // ✅ cambiado de "contraseña" a "contrasena"
  direccion = '';
  telefono = '';
  errorMessage = '';
  successMessage = '';
logoVisible = true;
  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    const data = {
      nombre: this.nombre,
      correo: this.correo,
      contrasena: this.contrasena, // coincide con la propiedad y columna DB
      direccion: this.direccion,
      telefono: this.telefono
    };

    this.http.post('http://localhost:3000/api/auth/register', data)
      .subscribe({
        next: (res: any) => {
          this.successMessage = 'Usuario registrado correctamente';
          this.errorMessage = '';
          // Redirigir al login
          setTimeout(() => this.router.navigate(['/cliente/login']), 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al registrar';
          this.successMessage = '';
        }
      });
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  nombre = '';
  correo = '';
  contrasena = '';      // ← usa 'contrasena' (sin ñ) para alinear con backend
  direccion = '';
  telefono = '';

  errorMessage = '';
  successMessage = '';
  logoVisible = true;
  cargando = false;

  // Usa tu endpoint de AWS (tal cual lo pasaste)
  private apiUrl = 'https://fbcvf8wdsb.execute-api.us-east-1.amazonaws.com/v1/proyectos/resgistros';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validaciones mínimas
    if (!this.correo || !this.contrasena) {
      this.errorMessage = 'Correo y contraseña son obligatorios.';
      return;
    }

    const data = {
      nombre: this.nombre?.trim(),
      correo: this.correo?.trim(),
      contrasena: this.contrasena?.trim(),
      direccion: this.direccion?.trim(),
      telefono: this.telefono?.trim()
    };

    this.cargando = true;

    // En API Gateway a veces conviene pedir 'text' y luego parsear
    this.http.post(this.apiUrl, data, { responseType: 'text' }).subscribe({
      next: (raw: string) => {
        this.cargando = false;

        let payload: any = raw;
        // 1) Si viene texto, intenta parsear
        try { payload = JSON.parse(raw); } catch { /* dejar como está */ }

        // 2) Si viene envuelto en { statusCode, body: '...' } o { body: '...' }
        if (payload && payload.body !== undefined) {
          try { payload = JSON.parse(payload.body); } catch { payload = {}; }
        }

        // Soportar varias convenciones: { ok: true, data:{...} } o { login: true, usuario:{...} } o plano
        const ok = payload?.ok ?? payload?.login ?? (!!payload?.data || !!payload?.idUsuario);

        if (!ok) {
          this.errorMessage = payload?.message || payload?.mensaje || 'No se pudo registrar el usuario.';
          return;
        }

        this.successMessage = 'Usuario registrado correctamente';
        // redirigir al login después de un breve delay
        setTimeout(() => this.router.navigate(['/cliente/login']), 1200);
      },
      error: (err) => {
        this.cargando = false;
        // Si API Gateway responde 4xx/5xx con JSON
        const msg = err?.error;
        let parsed: any = msg;
        try { parsed = typeof msg === 'string' ? JSON.parse(msg) : msg; } catch {}
        if (parsed?.body) {
          try { parsed = JSON.parse(parsed.body); } catch {}
        }
        this.errorMessage = parsed?.message || parsed?.mensaje || 'Error al registrar';
      }
    });
  }
}

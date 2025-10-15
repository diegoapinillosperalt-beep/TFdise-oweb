import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule, CommonModule, RouterModule]
})
export class Login {
  correo = '';
  contrasena = '';
  errorMessage = '';
  cargando: boolean = false;
  logoVisible: boolean = true;

  // endpoint local (incluido tal como pediste)
  private localUrl = 'http://localhost:3000/api/auth/login';

  constructor(
    private router: Router,
    private http: HttpClient,
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  onLogin() {
    this.errorMessage = '';
    const data = { correo: this.correo.trim(), contrasena: this.contrasena.trim() };

    if (!data.correo || !data.contrasena) {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña.';
      return;
    }
    this.cargando = true;
    console.log('📤 Enviando credenciales:', data);

    // 1) Intento contra backend LOCAL
    this.http.post<any>(this.localUrl, data).subscribe({
      next: (res) => this.handleLoginSuccess(res),
      error: (err) => {
        this.cargando = false;
        console.warn('⚠️ Local no disponible, usando ProjectService…', err?.message || err);
        // 2) Fallback: ProjectService (tu endpoint previo)
        this.projectService.loginUsuario(data).subscribe({
          next: (res2: any) => this.handleProjectServiceResponse(res2),
          error: (err2: any) => {
            console.error('❌ Error en ProjectService:', err2);
            this.cargando = false;
            this.errorMessage = err2?.error?.message || 'No se pudo conectar con el servidor.';
          }
        });
      }
    });
  }

  // --- Normaliza la respuesta del ProjectService (puede venir con body string) ---
  private handleProjectServiceResponse(res: any) {
    console.log('📥 Respuesta ProjectService:', res);

    let payload: any = res;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch {}
    }
    if (payload?.body !== undefined) {
      const b = payload.body;
      if (typeof b === 'string') {
        try { payload = JSON.parse(b); } catch { payload = {}; }
      } else {
        payload = b;
      }
    }

    const ok = payload?.ok ?? payload?.login ?? false;
    if (!ok) {
      this.errorMessage = payload?.message || payload?.mensaje || 'Usuario o contraseña incorrectos.';
      return;
    }

    const u = payload?.data ?? payload?.usuario ?? payload;
    this.finishLogin(u);
  }

  // --- Maneja respuesta del backend local (ya debería venir plana) ---
  private handleLoginSuccess(res: any) {
    console.log('📥 Respuesta LOCAL:', res);
    // Soporta estructuras: {ok, data:{...}} o plano { idUsuario, correo, rol, ... }
    const u = res?.data ?? res;
    this.finishLogin(u);
  }

  // --- Guarda sesión y redirige manteniendo 'rol' ---
  private finishLogin(u: any) {
    const rolRaw = u?.rol;           // podría venir "1" o 1
    const rolNum = Number(rolRaw);

    if (!u?.idUsuario || Number.isNaN(rolNum)) {
      this.errorMessage = 'Respuesta inválida del servidor.';
      return;
    }

    // Guardar sesión conservando 'rol'
    this.authService.setLogin({
      idUsuario: u.idUsuario,
      email: u.correo,
      isAdmin: rolNum === 1
    });

    // Redirección por rol
    if (rolNum === 1) {
      console.log('👑 Admin → /admin/admin-menu');
      this.router.navigateByUrl('/admin/admin-menu');
    } else {
      console.log('👤 Usuario → /');
      this.router.navigateByUrl('/');
    }
  }
}

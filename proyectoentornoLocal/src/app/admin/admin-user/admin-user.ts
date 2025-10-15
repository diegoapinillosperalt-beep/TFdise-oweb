import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-user.html',
  styleUrls: ['./admin-user.css']
})
export class AdminUser implements OnInit {
  usuarios: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<any[]>('http://localhost:3000/api/admin/usuarios')
      .subscribe({
        next: data => this.usuarios = data,
        error: err => console.error('Error cargando usuarios:', err)
      });
  }

  editarUsuario(usuario: any) {
    console.log('Editar', usuario);
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.http.delete(`http://localhost:3000/api/admin/usuarios/${id}`)
        .subscribe({
          next: () => this.cargarUsuarios(),
          error: err => console.error('Error eliminando usuario:', err)
        });
    }
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminMenuForm } from '../admin-menu-form/admin-menu-form'; // importa el form
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: string;
  disponible: boolean;
}

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.html',
  styleUrls: ['./admin-menu.css'],
  imports:[FormsModule,CommonModule]
})
export class AdminMenu {

  // ⚡ usamos los productos de AdminMenuForm
  get productos(): Producto[] {
    return AdminMenuForm.products;
  }

  constructor(private router: Router) {}

  nuevoProducto() {
  this.router.navigate(['/admin/admin-menu/form']);
}

  editarProducto(id: number) {
  this.router.navigate([`/admin/admin-menu/form/${id}`]);
}

  eliminarProducto(id: number) {
    const index = AdminMenuForm.products.findIndex(p => p.id === id);
    if (index > -1) {
      AdminMenuForm.products.splice(index, 1);
    }
  }
}

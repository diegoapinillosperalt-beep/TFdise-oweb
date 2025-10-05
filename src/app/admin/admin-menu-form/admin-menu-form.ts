import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
}

@Component({
  selector: 'app-admin-menu-form',
  templateUrl: './admin-menu-form.html',
  styleUrls: ['./admin-menu-form.css'],
  standalone: true,
  imports: [FormsModule]
})
export class AdminMenuForm {
  producto: Product = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    disponible: true
  };

  editMode = false;

  static products: Product[] = [
    { id: 1, nombre: 'Lomo Saltado', descripcion: 'Clásico peruano', precio: 25, categoria: 'Plato Fuerte', disponible: true },
    { id: 2, nombre: 'Ceviche', descripcion: 'Pescado fresco con limón', precio: 30, categoria: 'Entrada', disponible: true }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.editMode = true;
      const encontrado = AdminMenuForm.products.find(p => p.id === id);
      if (encontrado) {
        this.producto = { ...encontrado };
      }
    }
  }

  guardarProducto() {
    if (this.editMode) {
      const index = AdminMenuForm.products.findIndex(p => p.id === this.producto.id);
      if (index > -1) {
        AdminMenuForm.products[index] = this.producto;
      }
    } else {
      const nuevoId = AdminMenuForm.products.length > 0
        ? Math.max(...AdminMenuForm.products.map(p => p.id)) + 1
        : 1;
      this.producto.id = nuevoId;
      AdminMenuForm.products.push(this.producto);
    }
    this.router.navigate(['/admin/admin-menu']);
  }

  cancelar() {
    this.router.navigate(['/admin/admin-menu']);
  }
}

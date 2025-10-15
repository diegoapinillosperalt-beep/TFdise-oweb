import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminMenuForm } from '../admin-menu-form/admin-menu-form'; // importa el form
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuService, Plato } from '../../services/menu';

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
  imports: [FormsModule, CommonModule]
})
export class AdminMenu {

  productos: Plato[] = [];  // ahora será la lista desde la BD

  constructor(private router: Router, private menuService: MenuService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.menuService.listarMenu().subscribe(data => {
      this.productos = data;
    });
  }

  nuevoProducto() {
    this.router.navigate(['/admin/admin-menu/form']);
  }

editarProducto(id?: number) {
  if (!id) return;
  this.router.navigate(['/admin/admin-menu/form', id]); // coincide con la ruta
}



eliminarProducto(id?: number) {
  if (!id) return;

  const confirmar = confirm('¿Estás seguro de eliminar este producto?');
  if (!confirmar) return;

  this.menuService.eliminarPlato(id).subscribe({
    next: () => {
      alert('✅ Producto eliminado correctamente.');
      this.cargarProductos(); // refresca la lista
    },
    error: (err) => {
      console.error('Error al eliminar el producto:', err);
      alert('❌ Error al eliminar producto.');
    }
  });
}

}


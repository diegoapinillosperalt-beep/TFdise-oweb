import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../services/carrito';
import { MenuService, Plato } from '../services/menu';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // ✅ no necesitamos HttpClientModule aquí
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnInit {
  searchTerm = '';
  platos: { id: number; nombre: string; precio: number; img: string }[] = [];

  constructor(
    private carritoService: CarritoService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    // Consumir API local
    this.menuService.listarMenu().subscribe({
      next: (data) => {
        this.platos = data.map(p => ({
  id: p.idPlato ?? 0,
  nombre: p.Plato,
  precio: p.Precio,
  img: (p.URLImagen && p.URLImagen.trim() !== '') 
       ? 'http://localhost:3000/uploads/' + p.URLImagen 
       : 'assets/logoprincipal.png'
}));

      },
      error: (err) => console.error('Error al cargar el menú', err)
    });
  }

  get platosFiltrados() {
    return this.platos.filter(p =>
      p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  agregarAlCarrito(plato: any) {
    this.carritoService.addItem(plato);
  }
}

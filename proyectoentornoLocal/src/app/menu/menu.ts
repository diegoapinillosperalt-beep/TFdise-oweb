import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../services/carrito';
import { MenuService } from '../services/menu';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnInit {
  searchTerm = '';
  categorias: string[] = [];
  agrupado: { [categoria: string]: any[] } = {};
  activeCategoria: string = '';
  cargando = true;
  errorApi = false;

  constructor(
    private carritoService: CarritoService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.menuService.listarMenu().subscribe({
      next: (data) => {
        const platos = data.map(p => ({
          id: p.idPlato ?? 0,
          nombre: p.Plato,
          descripcion: p.Descripcion ?? '',
          precio: p.Precio,
          categoria: this.obtenerNombreCategoria(p.idCategoria),
          img: (p.URLImagen && p.URLImagen.trim() !== '')
            ? 'http://localhost:3000/uploads/' + p.URLImagen
            : 'assets/logoprincipal.png'
        }));

        // 🔹 Agrupamos los platos por categoría
        this.agruparPorCategoria(platos);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar el menú', err);
        this.errorApi = true;
        this.cargando = false;
      }
    });
  }

  obtenerNombreCategoria(idCategoria: number): string {
    switch (idCategoria) {
      case 1: return 'Entradas';
      case 2: return 'Platos de Fondo';
      case 3: return 'Bebidas';
      case 4: return 'Postres';
      default: return 'Otros';
    }
  }

  agruparPorCategoria(platos: any[]): void {
    const agrupadoTemp: { [categoria: string]: any[] } = {};
    platos.forEach(p => {
      if (!agrupadoTemp[p.categoria]) agrupadoTemp[p.categoria] = [];
      agrupadoTemp[p.categoria].push(p);
    });

    this.agrupado = agrupadoTemp;
    this.categorias = Object.keys(this.agrupado);
    this.activeCategoria = this.categorias[0] ?? '';
  }

  onBuscar(): void {
    // 🔹 Si el buscador está vacío, volvemos a mostrar todo
    if (this.searchTerm.trim() === '') {
      this.menuService.listarMenu().subscribe({
        next: (data) => this.agruparPorCategoria(
          data.map(p => ({
            id: p.idPlato ?? 0,
            nombre: p.Plato,
            descripcion: p.Descripcion ?? '',
            precio: p.Precio,
            categoria: this.obtenerNombreCategoria(p.idCategoria),
            img: (p.URLImagen && p.URLImagen.trim() !== '')
              ? 'http://localhost:3000/uploads/' + p.URLImagen
              : 'assets/logoprincipal.png'
          }))
        )
      });
      return;
    }

    // 🔹 Filtrado en memoria
    const filtrado: any[] = [];
    Object.values(this.agrupado).forEach(lista => {
      lista.forEach(p => {
        if (p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())) {
          filtrado.push(p);
        }
      });
    });
    this.agruparPorCategoria(filtrado);
  }

  goTo(categoria: string): void {
    this.activeCategoria = categoria;
    const element = document.getElementById('cat-' + this.slug(categoria));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  slug(nombre: string): string {
    return nombre.toLowerCase().replace(/\s+/g, '-');
  }

  agregarAlCarrito(plato: any): void {
    this.carritoService.addItem(plato);
  }
}

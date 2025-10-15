import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CarritoService } from '../services/carrito';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnInit {
  searchTerm = '';
  cargando = true;
  errorApi = false;

  platos: any[] = [];
  categorias: string[] = [];
  agrupado: Record<string, any[]> = {};
  activeCategoria = '';

  // 🔗 Endpoint AWS Lambda / API Gateway
  private apiUrl = 'https://fbcvf8wdsb.execute-api.us-east-1.amazonaws.com/v1/proyectos';

  constructor(private http: HttpClient, private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.obtenerPlatosDesdeAWS();
  }

  /** ================================
   * 🔹 Cargar platos desde API AWS
   * ================================ */
  private obtenerPlatosDesdeAWS(): void {
    this.http.get<any>(this.apiUrl, { withCredentials: false }).pipe(
      catchError((error) => {
        console.error('❌ Error al conectar con la API AWS:', error);
        this.errorApi = true;
        this.cargando = false;

        // 🔸 Fallback local si falla el API
        return of({
          data: [
            { idPlato: 1, idCategoria: 1, plato: 'HUMITA SALADA', descripcion: 'Versión salada tradicional.', precio: 20, urlImagen: 'HUMITASALADA.png' },
            { idPlato: 2, idCategoria: 3, plato: 'CARAPULCRA', descripcion: 'Papa seca con cerdo.', precio: 21, urlImagen: 'logoPrincipal.png' }
          ]
        });
      })
    ).subscribe({
      next: (response) => {
        const data = response.data ?? [];

        if (data.length === 0) {
          this.errorApi = true;
          console.warn('⚠️ La API devolvió una respuesta vacía.');
        }

        const categoriasMap: Record<number, string> = {
          1: 'Entradas',
          2: 'Sopas',
          3: 'Platos de Fondo',
          4: 'Postres'
        };

        // 🥘 Normalizar los datos
        this.platos = data.map((p: any) => ({
          id: p.idPlato,
          nombre: p.plato,
          descripcion: p.descripcion,
          precio: p.precio,
          categoria: categoriasMap[p.idCategoria] ?? 'Otros',
          img: p.urlImagen ? `/${p.urlImagen}` : '/logoPrincipal.png'
        }));

        this.agruparPorCategoria();
        this.cargando = false;
      },
      error: (err) => {
        console.error('⚠️ Error procesando la respuesta:', err);
        this.cargando = false;
      }
    });
  }

  /** =================================
   * 🔍 Agrupar y filtrar por categoría
   * ================================= */
  private agruparPorCategoria(): void {
    this.agrupado = {};

    for (const p of this.platos) {
      // 🔹 Aplicar filtro de búsqueda
      if (!p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())) continue;

      const cat = p.categoria;
      if (!this.agrupado[cat]) this.agrupado[cat] = [];
      this.agrupado[cat].push(p);
    }

    this.categorias = Object.keys(this.agrupado);
    this.activeCategoria = this.categorias[0] || '';
  }

  /** =================================
   * 🔹 Actualizar búsqueda al escribir
   * ================================= */
  onBuscar(): void {
    this.agruparPorCategoria();
  }

  /** =================================
   * 🔹 Ir a sección de categoría
   * ================================= */
  goTo(cat: string): void {
    const el = document.getElementById('cat-' + this.slug(cat));
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: 'smooth' });
    this.activeCategoria = cat;
  }

  /** =================================
   * 🔹 Generar slug amigable para IDs
   * ================================= */
  slug(cat: string): string {
    return cat.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }

  /** =================================
   * 🛒 Agregar plato al carrito
   * ================================= */
  agregarAlCarrito(plato: any): void {
    this.carritoService.addItem(plato);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlatosService {
  // 🔗 Endpoint de AWS Lambda / API Gateway
  private apiUrl = 'https://fbcvf8wdsb.execute-api.us-east-1.amazonaws.com/v1/proyectos';

  constructor(private http: HttpClient) {}

  /**
   * 🔹 Obtener todos los platos
   */
  getPlatos(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => response.data || []),
      catchError((error) => {
        console.error('❌ Error al obtener platos desde AWS:', error);
        return of([]); // Retorna lista vacía en caso de error
      })
    );
  }

  /**
   * 🔹 Obtener detalle de un plato por ID
   */
  getPlatoDetalle(id: string | number): Observable<any | null> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        const platos = response.data || [];
        const plato = platos.find((p: any) => p.idPlato == id);
        if (!plato) {
          console.warn(`⚠️ No se encontró el plato con id ${id}`);
          return null;
        }

        // Normalizar la respuesta para usarla en tu componente detalle
        return {
          id: plato.idPlato,
          nombre: plato.plato,
          descripcion: plato.descripcion,
          precio: plato.precio,
          categoria: this.obtenerCategoria(plato.idCategoria),
          img: plato.urlImagen ? `/${plato.urlImagen}` : '/logoPrincipal.png'
        };
      }),
      catchError((error) => {
        console.error('❌ Error al obtener el detalle del plato:', error);
        return of(null);
      })
    );
  }

  /**
   * 🔹 Traducir ID de categoría a nombre legible
   */
  private obtenerCategoria(idCategoria: number): string {
    const categorias: Record<number, string> = {
      1: 'Entradas',
      2: 'Sopas',
      3: 'Platos de Fondo',
      4: 'Postres'
    };
    return categorias[idCategoria] || 'Otros';
  }
}

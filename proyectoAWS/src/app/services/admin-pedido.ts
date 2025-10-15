import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface PedidoAdmin {
  idPedido: number;
  FechaPedido: string;
  Total: number;
  idEstado: string; // la API puede devolver texto (Pendiente/En camino/Entregado)
  cliente: string;
  detalles: {
    idPlato: number;
    nombrePlato: string;
    Cantidad: number;
    PrecioUnitario: number;
    Subtotal: number;
  }[];
  cargando?: boolean; // opcional para UX
}

@Injectable({ providedIn: 'root' })
export class AdminPedidoService {
  private readonly apiBase = 'https://fbcvf8wdsb.execute-api.us-east-1.amazonaws.com';
  private readonly stage   = 'v1';
  private readonly baseUrl = `${this.apiBase}/${this.stage}/proyectos`;

  constructor(private http: HttpClient) {}

  /** 🔹 LISTAR pedidos (admin) con tu nuevo endpoint /admin */
  obtenerPedidos(): Observable<PedidoAdmin[]> {
    return this.http
      .get(`${this.baseUrl}/admin`, { responseType: 'text' })
      .pipe(
        map(raw => this.parseAwsArray(raw))
      ) as Observable<PedidoAdmin[]>;
  }

  /**
   * 🔸 ACTUALIZAR estado (deja esta versión si ya tienes el endpoint /pedidos/estado).
   * Si tu API para admin usa otra ruta (p.ej. /admin/estado), dime y lo cambiamos.
   */
  actualizarEstado(idPedido: number, idEstado: number | string): Observable<any> {
    const estado = this.mapEstadoIdATexto(idEstado);
    return this.http.post(`${this.baseUrl}/admin/estado`, { idPedido, estado });
  }

  // ===== Helpers para desempaquetar respuestas de API Gateway =====
  private parseAws(raw: any): any {
    let p: any = raw;
    try { p = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return raw; }
    if (p && Object.prototype.hasOwnProperty.call(p, 'body')) {
      try { p = typeof p.body === 'string' ? JSON.parse(p.body) : p.body; } catch {}
    }
    return p;
  }
  private parseAwsArray(raw: any): any[] {
    const p = this.parseAws(raw);
    if (Array.isArray(p)) return p;
    if (p && Array.isArray(p.data)) return p.data;
    return [];
  }

  /** Convierte 1/2/3 → texto; si ya es texto, lo normaliza */
  private mapEstadoIdATexto(v: number | string): string {
    const s = String(v).trim().toLowerCase();
    if (s === '1' || s === 'pendiente') return 'Pendiente';
    if (s === '2' || s === 'en camino' || s === 'en_camino') return 'En camino';
    if (s === '3' || s === 'entregado') return 'Entregado';
    return String(v);
  }
}

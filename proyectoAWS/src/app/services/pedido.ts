// src/app/services/pedido.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DatosPedido } from './datospedido';
import { Producto } from './carrito';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiBase = 'https://fbcvf8wdsb.execute-api.us-east-1.amazonaws.com/v1/proyectos';

  constructor(private http: HttpClient) {}

  crearPedido(
    idUsuario: number,
    datosPedido: DatosPedido,
    items: Producto[],
    metodoPago: string
  ) {
    const bodyAWS = {
      idUsuario,
      idDistrito: Number(datosPedido?.idDistrito) || 1,
      items: (items || []).map(i => ({
        idPlato: i.id,
        cantidad: i.cantidad || 1,
        precio: i.precio
      }))
    };
    return this.http.post(`${this.apiBase}/pedidos`, bodyAWS);
  }

  /** <<< CORREGIDO >>> */
  obtenerPedidosPorUsuario(idUsuario: number): Observable<any[]> {
    const url = `${this.apiBase}/pedidos?usuario=${idUsuario}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(raw => this.parseAwsArray(raw))
    );
  }

  // ===== Helpers: desempaquetar { body: '...' } o { data: [...] } =====
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
}

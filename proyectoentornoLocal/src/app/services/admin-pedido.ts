import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PedidoAdmin {
  idPedido: number;
  FechaPedido: string;
  Total: number;
  idEstado: string;
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
  private apiUrl = 'http://localhost:3000/api/admin/pedidos';

  constructor(private http: HttpClient) {}

  // Obtener todos los pedidos
  obtenerPedidos(): Observable<PedidoAdmin[]> {
    return this.http.get<PedidoAdmin[]>(this.apiUrl);
  }

  // Actualizar estado de un pedido
  actualizarEstado(idPedido: number, idEstado: number | string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idPedido}`, { idEstado });
  }
}

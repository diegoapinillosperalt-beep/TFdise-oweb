import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosPedido } from './datospedido';
import { Producto } from './carrito';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = 'http://localhost:3000/api/pedido'; // ⚡ ruta backend

  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo pedido en el backend
   */
  crearPedido(
  idUsuario: number,
  datosPedido: DatosPedido,
  items: Producto[],
  metodoPago: string
) {
  const pedido = {
    idUsuario: idUsuario,
    idDistrito: datosPedido.idDistrito,
    total: items.reduce((sum, item) => sum + item.precio * (item.cantidad || 1), 0),
    estado: 'Pendiente',
    detalles: items.map(item => ({
      idPlato: item.id,
      cantidad: item.cantidad || 1,
      precioUnitario: item.precio,
      subtotal: item.precio * (item.cantidad || 1)
    })),
    metodoPago
  };

  return this.http.post(this.apiUrl, pedido);
}



  /**
   * Obtiene los pedidos realizados por un usuario (según su email)
   */
  obtenerPedidos(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?emailUsuario=${email}`);
  }
  obtenerPedidosPorUsuario(idUsuario: number) {
  return this.http.get<any[]>(`${this.apiUrl}?idUsuario=${idUsuario}`);
}

}

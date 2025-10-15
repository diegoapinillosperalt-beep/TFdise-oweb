import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService, Producto } from '../../services/carrito';
import { AuthService } from '../../services/auth';
import { DatosPedidoService, DatosPedido } from '../../services/datospedido';
import { PedidoService } from '../../services/pedido';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago.html',
  styleUrls: ['./pago.css']
})
export class Pago {
  metodo: 'tarjeta' | 'yape' | 'plin' = 'tarjeta';
  numeroTarjeta = '';
  nombreTitular = '';
  fechaExp = '';
  cvv = '';
  phone = '';
  mensaje = '';
  procesando = false;
  items: Producto[] = [];
  datosPedido: DatosPedido;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private pedidoService: PedidoService,
    private datosPedidoService: DatosPedidoService,
    private router: Router
  ) {
    this.items = this.carritoService.getItems();
    this.datosPedido = this.datosPedidoService.getDatos();
  }

  getTotal(): number {
    return this.items.reduce((acc, i) => acc + (i.precio * (i.cantidad || 1)), 0);
  }

  async procesarPago() {
  this.procesando = true;
  this.mensaje = '';

  try {
    const usuarioId = this.authService.getUserId();
    if (!usuarioId) {
      this.mensaje = 'Debes iniciar sesión para continuar.';
      this.procesando = false;
      return;
    }

    if (this.items.length === 0) {
      this.mensaje = 'Tu carrito está vacío.';
      this.procesando = false;
      return;
    }

    // ⚡ Asegurarse de que haya un distrito seleccionado o dar un valor por defecto
    if (!this.datosPedido.idDistrito) {
      this.datosPedido.idDistrito = 1; // ⚡ solo si 1 existe en la tabla Distritos
      // o mostrar error en vez de asignar valor por defecto
      // this.mensaje = 'Debes seleccionar un distrito.';
      // this.procesando = false;
      // return;
    }

    await this.pedidoService
      .crearPedido(usuarioId, this.datosPedido, this.items, this.metodo)
      .toPromise();

    this.carritoService.clearCart();
    this.datosPedidoService.clear();

    this.mensaje = '✅ Pedido realizado con éxito.';
    setTimeout(() => this.router.navigate(['/']), 2000);
  } catch (err) {
    console.error('Error al crear pedido:', err);
    this.mensaje = '❌ Ocurrió un error al procesar el pedido.';
  } finally {
    this.procesando = false;
  }
}

}

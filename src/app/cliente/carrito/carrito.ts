import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class Carrito {
  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {}

  get items() {
    return this.carritoService.getItems();
  }

  get total() {
    return this.carritoService.getTotal();
  }

  eliminar(id: string | number) {
    this.carritoService.removeItem(id);
  }

  vaciar() {
    this.carritoService.clearCart();
  }

  actualizarCantidad(id: string | number, cantidad: number | undefined) {
    this.carritoService.actualizarCantidad(id, cantidad ?? 1);
  }

  continuarPedido() {
    if (this.items.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    // 🚀 Ir al siguiente paso del flujo
    this.router.navigate(['/datospedido']);
  }
}

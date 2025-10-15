import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class Carrito {
  constructor(private carritoService: CarritoService) {}

  // Obtener items del carrito
  get items() {
    return this.carritoService.getItems();
  }

  // Obtener total a pagar
  get total(): number {
    return this.carritoService.getTotal();
  }

  // Eliminar un solo producto
  eliminar(id: string | number): void {
    this.carritoService.removeItem(id);
  }

  // Vaciar el carrito completo
  vaciar(): void {
    this.carritoService.clearCart();
  }

  // Actualizar la cantidad de un producto
  actualizarCantidad(id: string | number, cantidad: number | undefined): void {
    const nuevaCantidad = cantidad && cantidad >= 1 ? cantidad : 1;
    this.carritoService.actualizarCantidad(id, nuevaCantidad);
  }
}

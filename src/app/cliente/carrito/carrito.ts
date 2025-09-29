import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class Carrito {
  constructor(private carritoService: CarritoService) {}

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
    this.carritoService.clearCart();   // ✅ usar este nombre
  }

  actualizarCantidad(id: string | number, cantidad: number | undefined) {
    this.carritoService.actualizarCantidad(id, cantidad ?? 1);  // ✅ usar este nombre
  }
}

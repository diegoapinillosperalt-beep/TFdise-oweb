import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService, Producto } from '../../services/carrito';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido.html',
  styleUrls: ['./pedido.css']
})
export class Pedido {
  items: Producto[] = [];
  userEmail: string | null = null;
  fecha: Date = new Date();

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService
  ) {
    this.items = this.carritoService.getItems(); // debería estar vacío si vacías al pagar
    this.userEmail = this.authService.getUser();
  }

  getTotal(): number {
    return this.items.reduce((acc, i) => acc + (i.precio * (i.cantidad || 1)), 0);
  }
}

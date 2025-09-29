import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService, Producto } from '../../services/carrito';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago.html',
  styleUrls: ['./pago.css']
})
export class Pago {
  // Form
  metodo: 'tarjeta' | 'yape' | 'plin' = 'tarjeta';
  numeroTarjeta = '';
  nombreTitular = '';
  fechaExp = '';
  cvv = '';
  phone = ''; // para Yape/Plin

  // Estado
  mensaje = '';
  procesando = false;

  // Carrito
  items: Producto[] = [];

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.items = this.carritoService.getItems();
  }

  getTotal(): number {
    return this.items.reduce((acc, i) => acc + (i.precio * (i.cantidad || 1)), 0);
  }

  validarTarjeta(): boolean {
    const numOk = /^\d{16}$/.test(this.numeroTarjeta.replace(/\s+/g, ''));
    const cvvOk = /^\d{3}$/.test(this.cvv);
    const expOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(this.fechaExp);
    const nameOk = this.nombreTitular.trim().length > 2;
    return numOk && cvvOk && expOk && nameOk;
  }

  procesarPago() {
    this.mensaje = '';
    if (this.metodo === 'tarjeta') {
      if (!this.validarTarjeta()) {
        this.mensaje = '⚠️ Verifica los datos de la tarjeta (16 dígitos, MM/AA, CVV 3 dígitos).';
        return;
      }
    } else {
      if (!/^\d{9,12}$/.test(this.phone)) {
        this.mensaje = '⚠️ Ingresa un número de teléfono válido para Yape/Plin.';
        return;
      }
    }

    this.procesando = true;
    this.mensaje = '⏳ Procesando pago...';

    setTimeout(() => {
      this.procesando = false;
      this.mensaje = '✅ Pago realizado con éxito. ¡Gracias por tu compra!';

      // ✅ limpiar carrito al finalizar
      this.carritoService.clearCart();

      setTimeout(() => {
        this.router.navigate(['/cliente/pedido']);
      }, 1500);
    }, 1200);
  }

}

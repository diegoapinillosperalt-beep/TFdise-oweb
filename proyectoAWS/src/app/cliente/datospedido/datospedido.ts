import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatosPedidoService } from '../../services/datospedido'; // ✅ importar servicio

@Component({
  selector: 'app-datospedido',
  standalone: true,
  templateUrl: './datospedido.html',
  styleUrls: ['./datospedido.css'],
  imports: [CommonModule, FormsModule],
})
export class Datospedido {
  datos = {
    nombre: '',
    telefono: '',
    direccion: '',
    distrito: '',
    entrega: 'delivery',
    pago: 'tarjeta',
    notas: ''
  };

  constructor(
    private router: Router,
    private datosPedidoService: DatosPedidoService // ✅ inyectar servicio
  ) {}

  continuarAlPago() {
    console.log('✅ Guardando datos del pedido:', this.datos);
    this.datosPedidoService.setDatos(this.datos); // ✅ guardar en el servicio
    this.router.navigate(['/cliente/pago']); // ✅ avanzar al paso de pago
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPedidoService, PedidoAdmin } from '../../services/admin-pedido';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pedidos.html',
  styleUrls: ['./admin-pedidos.css']
})
export class AdminPedidosComponent implements OnInit {
  pedidos: PedidoAdmin[] = [];

  // 🔹 Ahora es un arreglo de objetos con id y nombre
  estados = [
    { id: '1', nombre: 'Pendiente' },
    { id: '2', nombre: 'En camino' },
    { id: '3', nombre: 'Entregado' }
  ];

  constructor(private adminPedidoService: AdminPedidoService) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.adminPedidoService.obtenerPedidos().subscribe({
      next: res => this.pedidos = res,
      error: err => console.error('Error al cargar pedidos:', err)
    });
  }

  cambiarEstado(pedido: PedidoAdmin, nuevoEstado: string) {
    this.adminPedidoService.actualizarEstado(pedido.idPedido, nuevoEstado).subscribe({
      next: () => pedido.idEstado = nuevoEstado,
      error: err => console.error('Error al actualizar estado:', err)
    });
  }

  getNombreEstado(idEstado: string) {
    const estado = this.estados.find(e => e.id === idEstado);
    return estado ? estado.nombre : 'Desconocido';
  }

  getTotal(detalles: any[]) {
    return detalles.reduce((sum, d) => sum + d.Subtotal, 0);
  }
}

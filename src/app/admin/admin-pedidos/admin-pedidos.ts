import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-pedidos.html',
  styleUrls: ['./admin-pedidos.css']
})
export class AdminPedidosComponent {
  pedidos = [
    { id: 1, cliente: 'Juan Perez', fecha: '2025-10-03', total: 50, estado: 'Pendiente' },
    { id: 2, cliente: 'Maria Lopez', fecha: '2025-10-03', total: 80, estado: 'En camino' },
    { id: 3, cliente: 'Carlos Ruiz', fecha: '2025-10-02', total: 35, estado: 'Entregado' },
    { id: 4, cliente: 'Ana Torres', fecha: '2025-10-02', total: 60, estado: 'Pendiente' },
    { id: 5, cliente: 'Luis Ramos', fecha: '2025-10-01', total: 45, estado: 'En camino' },
  ];

  cambiarEstado(pedido: any, nuevoEstado: string) {
    pedido.estado = nuevoEstado;
  }
}

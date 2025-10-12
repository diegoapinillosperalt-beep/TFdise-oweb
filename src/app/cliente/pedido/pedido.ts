import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido.html',
  styleUrls: ['./pedido.css']
})
export class Pedido {
  userEmail: string | null = null;
  pedidos: any[] = [];
  cargando = true;
  error: string | null = null;

  constructor(
      private authService: AuthService,
      private pedidoService: PedidoService
    ) {
      this.cargarPedidos(); // ya no necesitamos userEmail aquí
    }

    cargarPedidos() {
      const usuarioId = this.authService.getUserId(); // ⚡ idUsuario
      if (!usuarioId) {
        this.error = 'Debes iniciar sesión para ver tus pedidos.';
        this.cargando = false;
        return;
      }

      this.pedidoService.obtenerPedidosPorUsuario(usuarioId).subscribe({
        next: (res: any[]) => {
          this.pedidos = res;
          this.cargando = false;

          if (this.pedidos.length === 0) {
            this.error = 'No tienes pedidos registrados.';
          }
        },
        error: (err) => {
          console.error('Error al cargar pedidos', err);
          this.error = 'No se pudieron cargar los pedidos.';
          this.cargando = false;
        }
      });
    }


  getTotal(detalles: any[]): number {
    return detalles.reduce((acc, item) => acc + (item.PrecioUnitario * item.Cantidad), 0);
  }


  // ⚡ Aquí va el método para mostrar el estado en texto
  getEstadoText(idEstado: string | number): string {
  const id = Number(idEstado); // ⚡ convertir string a número
    switch(id) {
      case 1: return 'Pendiente';
      case 2: return 'En Camino';
      case 3: return 'Entregado';
      default: return 'Desconocido';
    }
  }




}

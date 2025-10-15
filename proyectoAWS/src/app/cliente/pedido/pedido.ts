// src/app/cliente/pedido/pedido.ts
import { Component, OnInit } from '@angular/core';
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
export class Pedido implements OnInit {
  userEmail: string | null = null;
  pedidos: any[] = [];
  cargando = true;
  error: string | null = null;

  // 🔽 IDs de pedidos actualmente expandidos
  private expanded = new Set<number>();

  constructor(
    private authService: AuthService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.cargando = true;
    this.error = null;

    const usuarioId = this.authService.getUserId();
    if (!usuarioId) {
      this.error = 'Debes iniciar sesión para ver tus pedidos.';
      this.cargando = false;
      return;
    }

    this.pedidoService.obtenerPedidosPorUsuario(usuarioId).subscribe({
      next: (res: any[]) => {
        this.pedidos = Array.isArray(res) ? res : [];
        this.cargando = false;

        // opcional: expandir el último pedido automáticamente
        if (this.pedidos.length) {
          this.expanded.clear();
          this.expanded.add(this.pedidos[0].idPedido); // o el más reciente
        }
      },
      error: (err) => {
        console.error('Error al cargar pedidos', err);
        this.error = 'No se pudieron cargar los pedidos.';
        this.cargando = false;
      }
    });
  }

  // ===== Helpers que ya tenías (abreviados) =====
  getEstadoText(estado: string | number | null | undefined): string {
    if (estado == null) return 'Desconocido';
    const s = String(estado).trim().toLowerCase();
    if (s === '1' || s === 'pendiente') return 'Pendiente';
    if (s === '2' || s === 'en camino' || s === 'en_camino') return 'En Camino';
    if (s === '3' || s === 'entregado') return 'Entregado';
    return String(estado);
  }
  statusClass(estado: string | number | null | undefined) {
    const s = String(estado ?? '').toLowerCase();
    if (s.includes('entregado') || s === '3') return 'badge-success';
    if (s.includes('camino') || s === '2')     return 'badge-info';
    if (s.includes('pendiente') || s === '1')  return 'badge-warning';
    return 'badge-muted';
  }
  getTotal(detalles: any[]): number {
    if (!Array.isArray(detalles)) return 0;
    return detalles.reduce((acc, item) => {
      const precio = Number(item.PrecioUnitario ?? item.precio ?? 0);
      const cant   = Number(item.Cantidad ?? item.cantidad ?? 0);
      return acc + (precio * cant);
    }, 0);
  }
  lineSubtotal(item: any): number {
    const precio = Number(item.PrecioUnitario ?? item.precio ?? 0);
    const cant   = Number(item.Cantidad ?? item.cantidad ?? 0);
    return precio * cant;
  }
  fmtMoney(v: number | string | null | undefined) {
    const n = Number(v ?? 0);
    return n.toLocaleString('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 });
  }
  fmtDate(d: any) {
    try {
      const dt = new Date(d);
      return dt.toLocaleString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch { return d ?? ''; }
  }
  trackByPedido = (_: number, p: any) => p?.idPedido ?? _;
  trackByDetalle = (_: number, d: any) => `${d?.idPlato}-${d?.Cantidad ?? d?.cantidad}-${_}`;

  // ===== Colapso / expansión =====
  isExpanded(id: number): boolean {
    return this.expanded.has(id);
  }
  toggle(id: number): void {
    if (this.expanded.has(id)) this.expanded.delete(id);
    else this.expanded.add(id);
  }
}

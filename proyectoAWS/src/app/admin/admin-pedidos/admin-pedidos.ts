import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPedidoService, PedidoAdmin } from '../../services/admin-pedido';

type PedidoAdminUI = PedidoAdmin & {
  estadoSeleccionado: string; // valor del <select> ('1'|'2'|'3')
  cargando: boolean;          // siempre boolean
};

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pedidos.html',
  styleUrls: ['./admin-pedidos.css']
})
export class AdminPedidosComponent implements OnInit {
  pedidos: PedidoAdminUI[] = [];
  cargando: boolean = true;
  error: string | null = null;

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
    this.cargando = true;
    this.error = null;

    this.adminPedidoService.obtenerPedidos().subscribe({
      next: (res) => {
        const base: PedidoAdmin[] = Array.isArray(res) ? res : [];
        this.pedidos = base.map(p => ({
          ...p,
          estadoSeleccionado: this.normalizeEstadoValue(p.idEstado),
          cargando: false
        }));
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        this.error = 'No se pudieron cargar los pedidos.';
        this.cargando = false;
      }
    });
  }

  /** Texto o num → '1' | '2' | '3' */
  normalizeEstadoValue(v: any): string {
    const s = String(v ?? '').trim().toLowerCase();
    if (s === '1' || s === 'pendiente') return '1';
    if (s === '2' || s === 'en camino' || s === 'en_camino') return '2';
    if (s === '3' || s === 'entregado') return '3';
    return '1'; // por defecto
  }

  /** Devuelve texto bonito desde id o texto crudo */
  getNombreEstado(idEstado: any): string {
    const s = String(idEstado).toLowerCase();
    if (['pendiente', 'en camino', 'en_camino', 'entregado'].includes(s)) {
      return s === 'en_camino' ? 'En camino' : s.charAt(0).toUpperCase() + s.slice(1);
    }
    const e = this.estados.find(x => x.id === String(idEstado));
    return e ? e.nombre : 'Desconocido';
  }

  /** Clase visual */
  statusClass(estado: any): string {
    const s = String(estado).toLowerCase();
    if (s.includes('entregado') || s === '3') return 'badge-success';
    if (s.includes('camino')    || s === '2') return 'badge-info';
    if (s.includes('pendiente') || s === '1') return 'badge-warning';
    return 'badge-secondary';
  }

  /** Habilita el botón si hubo cambio */
  puedeAceptar(p: PedidoAdminUI): boolean {
    const actualTexto = this.getNombreEstado(p.idEstado);
    const seleccionadoTexto = this.getNombreEstado(p.estadoSeleccionado);
    return actualTexto !== seleccionadoTexto;
  }

  /** Click en Aceptar → actualiza en la API */
  aceptarCambio(p: PedidoAdminUI) {
    const estadoTexto = this.getNombreEstado(p.estadoSeleccionado); // '1' → 'Pendiente'
    p.cargando = true;

    this.adminPedidoService.actualizarEstado(p.idPedido, estadoTexto).subscribe({
      next: () => {
        // Persistimos como texto legible
        (p as any).idEstado = estadoTexto;
        p.cargando = false;
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        p.cargando = false;
      }
    });
  }

  getTotal(detalles: any[]): number {
    if (!Array.isArray(detalles)) return 0;
    return detalles.reduce((sum, d) => sum + Number(d.Subtotal ?? d.subtotal ?? 0), 0);
  }

  fmtMoney(v: number | string | null | undefined): string {
    const n = Number(v ?? 0);
    return n.toLocaleString('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 });
  }

  fmtDate(d: any): string {
    try {
      const dt = new Date(d);
      return dt.toLocaleString('es-PE', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return String(d ?? ''); }
  }
}

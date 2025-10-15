import { Injectable } from '@angular/core';

export interface DatosPedido {
  nombre: string;
  telefono: string;
  direccion: string;
  distrito: string;
  entrega?: string;
  pago?: string;
  notas?: string;
  idUsuario?: number;
  idDistrito?: number | null;
}

@Injectable({ providedIn: 'root' })
export class DatosPedidoService {
  private datos: DatosPedido = {
    nombre: '',
    telefono: '',
    direccion: '',
    distrito: '',
    entrega: 'delivery',
    pago: 'tarjeta',
    notas: '',
    idDistrito: null
  };

  // ✅ Guarda o actualiza datos parciales
  setDatos(partial: Partial<DatosPedido>) {
    this.datos = { ...this.datos, ...partial };
  }

  // ✅ Devuelve todos los datos almacenados
  getDatos(): DatosPedido {
    return this.datos;
  }

  // ✅ Limpia los datos (para reiniciar el formulario)
  clear() {
    this.datos = {
      nombre: '',
      telefono: '',
      direccion: '',
      distrito: '',
      entrega: 'delivery',
      pago: 'tarjeta',
      notas: '',
      idDistrito: null
    };
  }
}

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

  //  Guarda o actualiza datos 
  setDatos(partial: Partial<DatosPedido>) {
    this.datos = { ...this.datos, ...partial };
  }

  //Devuelve todos los datos
  getDatos(): DatosPedido {
    return this.datos;
  }

  //Limpia los datos 
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

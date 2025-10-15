import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Producto {
  id: number | string;
  nombre: string;
  precio: number;
  cantidad?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private items: Producto[] = [];

  // Subject para poder reaccionar a cambios
  private itemsSubject = new BehaviorSubject<Producto[]>([]);
  itemsChanged = this.itemsSubject.asObservable();

  constructor() {}

  // Obtener todos los items
  getItems(): Producto[] {
    return this.items;
  }

  // Agregar producto al carrito
  addItem(producto: Producto) {
    const existente = this.items.find(p => p.id === producto.id);
    if (existente) {
      existente.cantidad = (existente.cantidad ?? 1) + (producto.cantidad ?? 1);
    } else {
      this.items.push({ ...producto, cantidad: producto.cantidad ?? 1 });
    }
    this.itemsSubject.next(this.items);
  }

  // Eliminar producto por id
  removeItem(id: number | string) {
    this.items = this.items.filter(p => p.id !== id);
    this.itemsSubject.next(this.items);
  }

  // Vaciar carrito
  clearCart() {
    this.items = [];
    this.itemsSubject.next(this.items);
  }

  // Actualizar cantidad de un producto
  actualizarCantidad(id: number | string, cantidad: number) {
    const producto = this.items.find(p => p.id === id);
    if (producto) {
      producto.cantidad = cantidad;
    }
    this.itemsSubject.next(this.items);
  }

  // Calcular total
  getTotal(): number {
    return this.items.reduce(
      (total, item) => total + (item.precio * (item.cantidad ?? 1)),
      0
    );
  }
}

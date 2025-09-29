import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CarritoService } from '../services/carrito';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule], // 👈 necesario para *ngFor, *ngIf, etc.
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu {
  searchTerm = '';
  platos = [
    { id: 1, nombre: 'ANTICUCHO', precio: 15, img: 'ANTICUCHO.png' },
    {  id: 2,nombre: 'CALDO DE GALLINA', precio: 18, img: 'CALDODEGALLINA.png' },
    {  id: 3,nombre: 'HUMIDA DULCE', precio: 14, img: 'HUMITADULCE.png' },
    {  id: 4,nombre: 'HUMITA SALADA', precio: 20, img: 'HUMITASALADA.png' },
    {  id: 5,nombre: 'MAZAMORRA MORADA', precio: 16, img: 'MAZMORADA.png' },
    {  id: 6,nombre: 'ARROZ CON LECHE', precio: 22, img: 'ARRZLECHE.png' },
    {  id: 7,nombre: 'PAPA RELLENA', precio: 17, img: 'PAPARELLENA.png' },
    {  id: 8,nombre: 'TRIPITA', precio: 19, img: 'TRIPITA.png' },
    {  id: 9,nombre: 'Carapulcra', precio: 21, img: 'logoprincipal.png' }
  ];
  
  constructor(private carritoService: CarritoService) {}


  get platosFiltrados() {
      return this.platos.filter(p =>
        p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

  agregarAlCarrito(plato: any) {
      this.carritoService.addItem(plato);
    }


}

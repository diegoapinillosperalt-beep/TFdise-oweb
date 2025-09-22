import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule,RouterModule], // 👈 necesario para *ngFor, *ngIf, etc.
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu {
  platos = [
    { nombre: 'ANTICUCHO', precio: 15, img: 'ANTICUCHO.png' },
    { nombre: 'CALDO DE GALLINA', precio: 18, img: 'CALDODEGALLINA.png' },
    { nombre: 'HUMIDA DULCE', precio: 14, img: 'HUMITADULCE.png' },
    { nombre: 'HUMITA SALADA', precio: 20, img: 'HUMITASALADA.png' },
    { nombre: 'MAZAMORRA MORADA', precio: 16, img: 'MAZMORADA.png' },
    { nombre: 'ARROZ CON LECHE', precio: 22, img: 'ARRZLECHE.png' },
    { nombre: 'PAPA RELLENA', precio: 17, img: 'PAPARELLENA.png' },
    { nombre: 'TRIPITA', precio: 19, img: 'TRIPITA.png' },
    { nombre: 'Carapulcra', precio: 21, img: 'logoprincipal.png' }
  ];
}

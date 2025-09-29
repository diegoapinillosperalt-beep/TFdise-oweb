import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 👈 agregar esto

@Component({
  selector: 'app-plato-detalle',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './plato-detalle.html',
  styleUrls: ['./plato-detalle.css']
})
export class PlatoDetalle {
  plato: any;

  platos = [
    {id: 1, nombre: 'ANTICUCHO', precio: 15, img: 'ANTICUCHO.png', descripcion: 'Un clásico criollo con culantro y pollo jugoso.' },
    { id: 2,nombre: 'CALDO DE GALLINA', precio: 18, img: 'CALDODEGALLINA.png', descripcion: 'Carne salteada con cebolla, tomate y papas fritas.' },
    {id: 3,nombre: 'HUMIDA DULCE', precio: 14, img: 'HUMITADULCE.png', descripcion: 'Pollo deshilachado en salsa cremosa de ají amarillo.' },
    {  id: 4,nombre: 'HUMITA SALADA', precio: 20, img: 'HUMITASALADA.png', descripcion: 'Carne de res al jugo con culantro y frijoles.' },
    {id: 5,nombre: 'MAZAMORRA MORADA', precio: 16, img: 'MAZMORADA.png', descripcion: 'Pasta con salsa de albahaca y queso fresco.' },
    { id: 6,nombre: 'ARROZ CON LECHE', precio: 22, img: 'ARRZLECHE.png', descripcion: 'Pescado fresco marinado en limón con ají y cebolla.' },
    { id: 7, nombre: 'PAPA RELLENA', precio: 17, img: 'PAPARELLENA.png', descripcion: 'Arroz frito estilo chifa con pollo y verduras.' },
    { id: 8,nombre: 'TRIPITA', precio: 19, img: 'TRIPITA.png', descripcion: 'El favorito del Perú, acompañado con papas y ensalada.' },
    {  id: 9,nombre: 'Carapulcra', precio: 21, img: 'logoprincipal.png', descripcion: 'Tradicional guiso andino de papa seca con cerdo.' }
  ];

  constructor(private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.plato = this.platos[+id];// busca el plato
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './principal.html',
  styleUrls: ['./principal.css']
})
export class Principal {
  menu = [
    { nombre: 'Arroz con Pollo', precio: 15, imagen: 'logoprincipal.png' },
    { nombre: 'Lomo Saltado', precio: 18, imagen: 'logoprincipal.png' },
    { nombre: 'Ají de Gallina', precio: 14, imagen: 'logoprincipal.png' }
  ];
}

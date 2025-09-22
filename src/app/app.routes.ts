import { Routes } from '@angular/router';
import { Principal } from './principal/principal';
import { Menu } from './menu/menu';
import { Contacto } from './contacto/contacto';
import { PlatoDetalle } from './plato-detalle/plato-detalle'; // 👈

export const routes: Routes = [
  { path: '', component: Principal },   // Página de inicio
  { path: 'menu', component: Menu },
  { path: 'contacto', component: Contacto },
  { path: 'plato/:id', component: PlatoDetalle }, // 👈 detalle dinámico
  { path: '**', redirectTo: '' }
];

import { Routes } from '@angular/router';
import { Principal } from './principal/principal';
import { Menu } from './menu/menu';
import { Contacto } from './contacto/contacto';
import { PlatoDetalle } from './plato-detalle/plato-detalle'; 
import { Carrito } from './cliente/carrito/carrito';
import { Pedido } from './cliente/pedido/pedido';
import { Login } from './cliente/login/login';
import { Pago } from './cliente/pago/pago';
import { AuthGuard } from './guards/auth-guard';

// 👇 importa también tus componentes de admin
import { AdminMenu} from './admin/admin-menu/admin-menu';
import { AdminMenuForm} from './admin/admin-menu-form/admin-menu-form';
import { AdminPedidosComponent } from './admin/admin-pedidos/admin-pedidos';

export const routes: Routes = [
  { path: '', component: Principal },   // Página de inicio
  { path: 'menu', component: Menu },
  { path: 'contacto', component: Contacto },
  { path: 'plato/:id', component: PlatoDetalle }, 
  { path: 'cliente/login', component: Login },
  { path: 'cliente/carrito', component: Carrito },
  { path: 'cliente/pedido', component: Pedido, canActivate: [AuthGuard] },
  { path: 'cliente/pago', component: Pago, canActivate: [AuthGuard] },
  { path: 'admin/pedidos', component: AdminPedidosComponent },
  // 🔑 Rutas admin
  { path: 'admin/admin-menu', component: AdminMenu },
  { path: 'admin/admin-menu/form', component: AdminMenuForm },
  { path: 'admin/admin-menu/form/:id', component: AdminMenuForm },

  { path: '**', redirectTo: '' }
];

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
import { AdminGuard } from './guards/admin-guard';
import { Datospedido} from './cliente/datospedido/datospedido';
import { Registro } from './cliente/registro/registro';



import { Layout } from './admin/layout/layout';
// 👇 importa también tus componentes de admin
import { AdminMenu} from './admin/admin-menu/admin-menu';
import { AdminMenuForm} from './admin/admin-menu-form/admin-menu-form';
import { AdminPedidosComponent } from './admin/admin-pedidos/admin-pedidos';
import { AdminUser } from './admin/admin-user/admin-user';


export const routes: Routes = [
  { path: '', component: Principal },   // Página de inicio
  { path: 'menu', component: Menu },
  { path: 'contacto', component: Contacto },
  { path: 'plato/:id', component: PlatoDetalle }, 
  { path: 'cliente/login', component: Login },
  { path: 'cliente/register', component: Registro }, // 🔥 ruta para el registro
  { path: 'cliente/carrito', component: Carrito },
  { path: 'cliente/pedido', component: Pedido, canActivate: [AuthGuard] },
  { path: 'cliente/pago', component: Pago, canActivate: [AuthGuard] },
  { path: 'cliente/datospedido', component: Datospedido ,canActivate: [AuthGuard]},

  
      {
      path: 'admin',
      component: Layout,
      canActivate: [AdminGuard],
      children: [
        { path: 'pedidos', component: AdminPedidosComponent },
        { path: 'admin-menu', component: AdminMenu },
        { path: 'admin-menu/form', component: AdminMenuForm },
        { path: 'admin-menu/form/:id', component: AdminMenuForm },
        { path: 'admin-user', component: AdminUser }, // 🔥 nuevo panel de usuarios
        { path: '', redirectTo: 'pedidos', pathMatch: 'full' }
      ]
    },
  { path: '**', redirectTo: '' }
];

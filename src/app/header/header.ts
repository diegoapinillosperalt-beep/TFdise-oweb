import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../services/carrito';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  carritoCount = 0;
  isLoggedIn = false;
  userEmail: string | null = null;
  isAdmin = false; // 🔥 bandera para admins

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // ✅ carrito
    this.carritoCount = this.getCarritoCount();
    this.carritoService.itemsChanged.subscribe((items: any[]) => {
      this.carritoCount = this.getCarritoCount(items);
    });

    // ✅ login
    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
    this.authService.userEmail$.subscribe(email => this.userEmail = email);

    // ✅ admin (ejemplo: tu AuthService debería exponer un observable/flag)
    this.authService.isAdmin$.subscribe(role => this.isAdmin = role);

    this.authService.checkLocalStorage(); // recuperar sesión
  }

  private getCarritoCount(items?: any[]): number {
    const lista = items || this.carritoService.getItems();
    return lista.reduce((sum, item) => sum + item.cantidad, 0);
  }

  logout() {
    this.authService.logout();
  }
}

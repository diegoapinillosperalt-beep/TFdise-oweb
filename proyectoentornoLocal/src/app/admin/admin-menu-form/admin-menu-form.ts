import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuService, Plato } from '../../services/menu';
import { CategoriaService } from '../../services/categoria';

@Component({
  selector: 'app-admin-menu-form',
  templateUrl: './admin-menu-form.html',
  styleUrls: ['./admin-menu-form.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class AdminMenuForm {

  producto: Plato = {
    idPlato: 0,
    idCategoria: 0,
    Plato: '',
    Descripcion: '',
    Precio: 0,
    URLImagen: ''
  };

  editMode = false;
  categorias: { id: number; nombre: string }[] = [];

  // ✅ Nueva propiedad para almacenar la imagen
  imagenSeleccionada: File | null = null;
  imagenTemporal: string | null = null; // 👈 agrega esta línea

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private categoriaService: CategoriaService
  ) {
    this.cargarCategorias();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.editMode = true;
        this.cargarProducto(id);
      }
    }
  }

  // 🔹 Cargar categorías desde el backend
  cargarCategorias() {
    this.categoriaService.listarCategorias().subscribe({
      next: data => {
        this.categorias = data.map(c => ({ id: c.idCategoria, nombre: c.Categoria }));
      },
      error: err => console.error('Error cargando categorías:', err)
    });
  }

  // 🔹 Cargar plato cuando se edita
  cargarProducto(id: number) {
    this.menuService.listarMenu().subscribe({
      next: platos => {
        const encontrado = platos.find(p => p.idPlato === id);
        if (encontrado) {
          this.producto = { ...encontrado, idPlato: encontrado.idPlato };
          this.imagenTemporal = this.producto.URLImagen || null;

          console.log('Producto cargado:', this.producto);
        } else {
          this.router.navigate(['/admin/admin-menu']);
        }
      },
      error: err => console.error('Error cargando plato:', err)
    });
  }

  // 🔹 Capturar imagen seleccionada
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      console.log('📸 Imagen seleccionada:', file.name);
    }
  }

  // 🔹 Guardar o editar producto con FormData
  guardarProducto() {
    console.log('Producto a enviar:', this.producto);

    const formData = new FormData();
    formData.append('idCategoria', this.producto.idCategoria.toString());
    formData.append('Plato', this.producto.Plato);
    formData.append('Descripcion', this.producto.Descripcion);
    formData.append('Precio', this.producto.Precio.toString());

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    if (this.editMode) {
      this.menuService.editarPlatoFormData(this.producto.idPlato!, formData).subscribe({
        next: res => {
          console.log('✅ Edición exitosa', res);
          this.router.navigate(['/admin/admin-menu']);
        },
        error: err => console.error('❌ Error al editar plato:', err)
      });
    } else {
      this.menuService.crearPlatoFormData(formData).subscribe({
        next: res => {
          console.log('✅ Plato creado correctamente', res);
          this.router.navigate(['/admin/admin-menu']);
        },
        error: err => console.error('❌ Error al crear plato:', err)
      });
    }
  }

  cancelar() {
    this.router.navigate(['/admin/admin-menu']);
  }
}

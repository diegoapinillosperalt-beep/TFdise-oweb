// src/app/contacto/contacto.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContactoService } from '../services/contacto'; // ajusta la ruta si difiere

@Component({
  selector: 'app-contacto',
  standalone: true,                                    // ⬅️ standalone
  imports: [CommonModule, ReactiveFormsModule],        // ⬅️ directivas de formularios
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']                        // ⬅️ plural (no styleUrl)
})
export class Contacto {
  form: FormGroup;
  enviado = false;
  cargando = false;

  constructor(private fb: FormBuilder, private api: ContactoService) {
    // Inicialización del formulario aquí para evitar “used before initialization”
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  enviar(): void {
    if (this.form.invalid) return;
    this.cargando = true;
    this.api.enviar(this.form.value).subscribe({
      next: () => { this.enviado = true; this.cargando = false; this.form.reset(); },
      error: () => { this.cargando = false; alert('Ocurrió un error. Intenta de nuevo.'); }
    });
  }

  // atajo para validaciones en el template: f.nombre, f.correo, f.mensaje
  get f() { return this.form.controls; }
}

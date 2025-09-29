import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ContactoPayload {
  nombre: string;
  correo: string;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })   // <-- esto registra el servicio en el inyector raíz

export class ContactoService {
  constructor(private http: HttpClient) {}

  enviar(payload: ContactoPayload) {
    // cambia la URL por tu endpoint real
    return this.http.post('/api/contacto', payload);
  }
}

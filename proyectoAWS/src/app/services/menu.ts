import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Plato {
  idPlato?: number;   // ✅ opcional
  idCategoria: number;
  Plato: string;
  Descripcion: string;
  Precio: number;
  URLImagen?: string;
}


@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = 'http://localhost:3000/api/menu'; // ✅ tu API local

  constructor(private http: HttpClient) {}

  listarMenu(): Observable<Plato[]> {
    return this.http.get<Plato[]>(this.apiUrl);
  }

  crearPlato(plato: Plato): Observable<any> {
  console.log('POST a URL:', this.apiUrl, plato); // <- verifica la URL real
  return this.http.post(this.apiUrl, plato);
}


  editarPlato(id: number, plato: Plato): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, plato);
  }

  eliminarPlato(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  crearPlatoFormData(platoData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}`, platoData);
}

editarPlatoFormData(id: number, platoData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, platoData);
}

}

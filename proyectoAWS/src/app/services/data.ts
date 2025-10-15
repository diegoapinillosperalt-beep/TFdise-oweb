import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Plato {
  idProyecto: number;
  nombre: string;
  precio: number;
  direccion: string;
  ubicacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://fbcvf8wdsb.execute-api.us-east-1.amazonaws.com/v1/proyectos';

  constructor(private http: HttpClient) {}

  getPlatos(): Observable<{ data: Plato[] }> {
    return this.http.get<{ data: Plato[] }>(this.apiUrl);
  }
}

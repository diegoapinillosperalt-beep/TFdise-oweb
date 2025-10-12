import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlatosService {
  private apiUrl = 'http://localhost:3000/api/menu';

  constructor(private http: HttpClient) {}

  getPlatos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPlatoDetalle(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}

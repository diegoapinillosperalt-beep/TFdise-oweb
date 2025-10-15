import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private readonly http: HttpClient
  ) { }
loginUsuario(data: any) {
    return this.http.post('https://fbcvf8wdsb.execute-api.us-east-1.amazonaws.com/v1/proyectos', data, { responseType: 'json' });
  }
}

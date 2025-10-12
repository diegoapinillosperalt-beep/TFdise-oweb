import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PlatosService } from '../services/plato';

@Component({
  selector: 'app-plato-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './plato-detalle.html',
  styleUrls: ['./plato-detalle.css']
})
export class PlatoDetalle {
  plato: any;

  constructor(private route: ActivatedRoute, private platosService: PlatosService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.platosService.getPlatoDetalle(id).subscribe({
        next: data => this.plato = data,
        error: err => console.error('Error al obtener plato:', err)
      });
    }
  }
}

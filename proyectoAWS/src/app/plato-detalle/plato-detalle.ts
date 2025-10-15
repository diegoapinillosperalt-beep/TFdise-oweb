import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlatosService } from '../services/plato';

@Component({
  selector: 'app-plato-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plato-detalle.html',
  styleUrls: ['./plato-detalle.css']
})
export class PlatoDetalle implements OnInit {
  plato: any = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private platosService: PlatosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.platosService.getPlatoDetalle(id).subscribe((data) => {
        this.plato = data;
        this.cargando = false;
      });
    }
  }
}

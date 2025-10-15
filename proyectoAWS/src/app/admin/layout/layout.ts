import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
    imports: [CommonModule, RouterModule], // ✅ agrega RouterModule aquí
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}

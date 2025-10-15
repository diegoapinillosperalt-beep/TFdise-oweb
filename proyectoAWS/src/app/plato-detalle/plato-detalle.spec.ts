import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatoDetalle } from './plato-detalle';

describe('PlatoDetalle', () => {
  let component: PlatoDetalle;
  let fixture: ComponentFixture<PlatoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatoDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatoDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

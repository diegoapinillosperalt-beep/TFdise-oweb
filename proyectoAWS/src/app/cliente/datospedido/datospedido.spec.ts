import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Datospedido } from './datospedido';

describe('Datospedido', () => {
  let component: Datospedido;
  let fixture: ComponentFixture<Datospedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Datospedido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Datospedido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

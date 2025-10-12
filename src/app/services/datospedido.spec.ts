import { TestBed } from '@angular/core/testing';

import { Datospedido } from './datospedido';

describe('Datospedido', () => {
  let service: Datospedido;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Datospedido);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

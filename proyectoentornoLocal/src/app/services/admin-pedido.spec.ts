import { TestBed } from '@angular/core/testing';

import { AdminPedido } from './admin-pedido';

describe('AdminPedido', () => {
  let service: AdminPedido;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPedido);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

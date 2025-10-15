import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMenuForm } from './admin-menu-form';

describe('AdminMenuForm', () => {
  let component: AdminMenuForm;
  let fixture: ComponentFixture<AdminMenuForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMenuForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMenuForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

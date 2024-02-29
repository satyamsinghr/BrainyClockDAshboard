import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveBulkEmployeeComponent } from './remove-bulk-employee.component';

describe('RemoveBulkEmployeeComponent', () => {
  let component: RemoveBulkEmployeeComponent;
  let fixture: ComponentFixture<RemoveBulkEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveBulkEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveBulkEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBulkEmployeeComponent } from './add-bulk-employee.component';

describe('AddBulkEmployeeComponent', () => {
  let component: AddBulkEmployeeComponent;
  let fixture: ComponentFixture<AddBulkEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBulkEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBulkEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
